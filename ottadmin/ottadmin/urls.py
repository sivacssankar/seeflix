from django.contrib import admin
from django.urls import path
from adminhome import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.adminlogin,                       name="adminlogin"),
    path('movies_list',views.movies_list,            name="movielist"),
    path('create_movie',views.create_movie,          name="addmovie"),
    path('edit_movie/<int:id>/',views.edit_movie,    name="editmovie"),
    path('view_details/<int:id>/',views.view_details, name="viewdetail"),
    path('user_list',views.user_list,                name="userlist"),
    path('user_history/<int:id>/',views.user_history,          name="userhistory"),
    path('report',views.report,                      name="report"),
    path('profile',views.admin_profile,              name="profile"),
    path('delete/<int:id>/',views.delet,             name="delete"),
    path('user/block/<int:id>/',views.toggle_block,  name="toggle_block"),


    path('signup',views.Signup),
    path('login',views.userlogin),
    path('homepage',views.homepage),
    path('search',views.search),
    path('detail/<int:id>',views.movie_detail),
    path('watchlist',views.add_watchlist),
    path('viewwatchlist/',views.view_watchlist),
    path('history/',views.historyview),
    path('gg',views.addhis),
    path('delete/',views.delete_watchlist),
    path('profile/',views.user_profile),
    path('changepass',views.chpass),
]


urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)