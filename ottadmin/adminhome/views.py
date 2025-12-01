from django.shortcuts import redirect, render
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
#from quick fix on USer
from adminhome.models import User,MovieList,Watchlist,history
from django.contrib.auth import login, logout
from .models import MovieList,Watchlist,history,User

from django.core.paginator import Paginator

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.contrib.auth.decorators import login_required
def adminlogin(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Authenticate user using email and password
        user = authenticate(request, email=email, password=password)

        if user is not None and user.is_admin:
            login(request, user)  # Django's built-in login

            # Create a session for admin
            request.session['admin_id'] = user.id
            request.session['admin_email'] = user.email  # optional
            request.session['is_admin'] = True

            messages.success(request, 'Admin logged in successfully.')
            return redirect('movielist')
        else:
            messages.error(request, 'Invalid credentials or not an admin.')
            return redirect('adminlogin')
    
    # GET request → render login form
    return render(request, 'login.html')

    


from django.db.models import Q

@login_required(login_url='adminlogin')
def movies_list(request):
    query=request.GET.get("q","")
    if query:
        movie=MovieList.objects.filter(Q(title__icontains=query))
    else:
        movie=MovieList.objects.all()
    page=Paginator(movie,3)
    page_number=request.GET.get('page')
    page_obj=page.get_page(page_number)



    return render(request,'movies_list.html',{'movies':page_obj})


@login_required(login_url='adminlogin')
def admin_profile(request):
    email = request.session.get('admin_email')
    if not email:
        return redirect('adminlogin')
    
    if request.method == 'POST':
        current_password = request.POST.get('current_password')
        new_password = request.POST.get('new')
        # Authenticate using current password
        user = authenticate(request, email=email, password=current_password)
        if user is not None:
            # Update password using set_password()
            user.set_password(new_password)
            user.save()
            messages.success(request, "Password changed successfully. Please log in again.") 
    return render(request, 'profile.html')

    









@login_required(login_url='adminlogin')
def create_movie(request):
   if request.method=="POST":
       title=request.POST.get("title")
       desc=request.POST.get("description")
       thumb=request.FILES.get("thumbnail")
       video=request.FILES.get("video")
       MovieList.objects.create(title=title,desc=desc,thumb=thumb,video=video)
       return redirect('movielist')
   else:   
       return render(request,'create_movie.html')





@login_required(login_url='adminlogin')
def edit_movie(request,id):
    movie=MovieList.objects.get(id=id)   
    if request.method=="POST":

        movie.title=request.POST.get("ti")
        movie.desc=request.POST.get("d")
        if 't' in request.FILES:
            movie.thumb=request.FILES['t']
        if 'v' in request.FILES:
            movie.video=request.FILES['v']
        movie.save()
        return redirect('movielist')
    return render(request,'edit_movie.html',{'movie':movie})


@login_required(login_url='adminlogin')
def view_details(request,id):
   movie=MovieList.objects.get(id=id)
   return render(request,'view_details.html',{"movie":movie})


@login_required(login_url='adminlogin')
def delet(request,id):
    movie=MovieList.objects.get(id=id)
    movie.delete()
    return redirect("movielist")



@login_required(login_url='adminlogin')
def logout_admin(request,id):
    logout(request)
    return redirect("adminlogin")







@login_required(login_url='adminlogin')
def user_list(request):
   query=request.GET.get("q","")
   if query:
        user=User.objects.filter(Q(name__icontains=query))
   else:
       user=User.objects.filter(is_admin=0).order_by("id")
   paginator=Paginator(user,3)
   page_number=request.GET.get("page")
   page_obj=paginator.get_page(page_number)
   return render(request,'user_list.html',{'users':page_obj})



@login_required(login_url='adminlogin')
def toggle_block(request,id):
    user=User.objects.get(id=id)
    user.is_active=not user.is_active #toggle 0 1
    user.save()
    return redirect("userlist")

@login_required(login_url='adminlogin')
def user_history(request,id):
   user=User.objects.get(id=id)
   his=history.objects.filter(user=id).select_related("movie").order_by("-date")
   paginator=Paginator(his,3)
   page_number=request.GET.get("page")
   page_obj=paginator.get_page(page_number)
   return render(request,'user_history.html',{'user':user,'history':page_obj})





@login_required(login_url='adminlogin')
def report(request):
   movie=MovieList.objects.all().order_by('-count')
   paginator=Paginator(movie,3)
   page_number=request.GET.get("page")
   page_obj=paginator.get_page(page_number)
   return render(request,'report.html',{"page_obj":page_obj})




#user api section

@api_view(['POST'])
@permission_classes((AllowAny,))

def Signup(request):
        email  = request.data.get("email")
        password = request.data.get("password")
        name = request.data.get("name")
        print(name,email,password)
        if not name or not email or not password:
            return Response({'message':'All fields are required'})
        if User.objects.filter(email=email).exists():
            return  JsonResponse({'message':'Email already exist'})
        user = User.objects.create_user(email=email,password=password)
        user.name = name
        user.save()
        return JsonResponse({'message':'user created successsfully'} ,status = 200)



#login

from django.contrib.auth import authenticate
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from rest_framework.authtoken.models import Token

@api_view(["POST"])
@permission_classes((AllowAny,))
def userlogin(request):
    email = request.data.get("email")
    password = request.data.get("password")
    if email is None or password is None:
        return Response({'error': 'Please provide both username and password'},
                        status=HTTP_400_BAD_REQUEST)
    user = authenticate(email=email, password=password)
    if not user:
        return Response({'error': 'Invalid admin has blocked you'},
                        status=HTTP_404_NOT_FOUND)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key,'id':user.id},status=HTTP_200_OK)
    



# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def user



from .serializers import MovieSerializer,WatchlistSerializer,historyserializer,UserSerializer
from rest_framework.permissions import IsAuthenticated

# #homepage
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def homepage(request):
    movies=MovieList.objects.all()
    serializer=MovieSerializer(movies,many=True)
    return Response(serializer.data)




#search
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search(request):
   query=request.GET.get("title","")
   if query:
      movies=MovieList.objects.filter(title__icontains=query)
   else:
      movies=MovieList.objects.all()
   serializer = MovieSerializer(movies, many=True)
   return Response(serializer.data)






#movie detail
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def movie_detail(request,id):    
   movie=MovieList.objects.get(id=id)
   if not movie:
      return Response({"error":"movie not found"},status=HTTP_404_NOT_FOUND)
   serializer=MovieSerializer(movie)
   return Response(serializer.data)






#add to watchlist 
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_watchlist(request):
    userid = request.data.get("uid")
    movieid = request.data.get("mid")
    existing = Watchlist.objects.filter(user_id=userid, movie_id=movieid).first()
    if not userid or not movieid:
        return Response({"error": "Missing uid or mid"}, status=HTTP_404_NOT_FOUND)

    if existing:
        # If exists, delete (toggle off)
        existing.delete()
        return Response({"message": "Removed from Watchlist ❌", "status": "removed"}, status=HTTP_200_OK)
    else:
        # If not exists, create (toggle on)
        Watchlist.objects.create(user_id=userid, movie_id=movieid)
        return Response({"message": "Added to Watchlist ✅", "status": "added"}, status=HTTP_200_OK)
        
   


    
   








#view watchlist

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def view_watchlist(request):
    user_id = request.GET.get("iv",'')
    movies=Watchlist.objects.filter(user_id=user_id)
    if not movies or user_id is None:
        return Response({'error':'No Movies Found'},
                        status=HTTP_400_BAD_REQUEST)
    
    serializer=WatchlistSerializer(movies,many=True)
    return Response(serializer.data)









@api_view(["GET"])
@permission_classes([IsAuthenticated])
def historyview(request):
    userid= request.user.id
    his=history.objects.filter(user_id=userid)
    if not his or userid is None:
        return Response({'error':'failed noob'},status=HTTP_404_NOT_FOUND)
    hisserial=historyserializer(his,many=True)
    return Response(hisserial.data)















@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addhis(request):
    userid = request.user.id
    movieid = request.data.get("mid")

    if not userid or not movieid:
        return Response({"error": "Missing uid or mid"}, status=HTTP_404_NOT_FOUND)

    history.objects.create(movie_id=movieid, user_id=userid)
    movie=MovieList.objects.get(id=movieid)
    movie.count=movie.count+1
    movie.save()
    return Response({'message': 'Movie added to history successfully'}, status=200)

    








@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_watchlist(request):
   userid = request.data.get("uid")
   movieid = request.data.get("mid")
   if not userid or not movieid:
      return Response({"message": "userid and movieid are required"},status=HTTP_400_BAD_REQUEST)
   try:
      movie = Watchlist.objects.get(user_id=userid, movie_id=movieid)
      movie.delete()
      return Response({"message": "Movie removed"}, status=HTTP_200_OK)
   except Watchlist.DoesNotExist:
      return Response({"message": "Movie not found"}, status=HTTP_400_BAD_REQUEST)
   







@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_profile(request):
   user_id = request.GET.get("id",'')
   user=User.objects.get(id=user_id)
   if not user_id:
      return Response({"message": "Not Authorized"},
                      status=HTTP_400_BAD_REQUEST)
   serializer=UserSerializer(user)
   return Response(serializer.data)







from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from rest_framework import status

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def chpass(request):
    userid=request.data.get("id")
    newpassword=request.data.get('newpassword')
    print(newpassword)
    if not userid or not newpassword:
        return Response({"message": "userid and new password not found"}, status=HTTP_400_BAD_REQUEST)
    try:
      user = User.objects.get(id=userid)
    except User.DoesNotExist:
      return Response({"message": "user not found"}, status=HTTP_400_BAD_REQUEST)
    user.set_password(newpassword)
    user.save()
    return Response({"success": f"Password updated successfully for user"},status=status.HTTP_200_OK)












