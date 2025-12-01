from django.contrib.auth.models import BaseUserManager,AbstractBaseUser,AbstractUser 
from django.db import models 

class UserManager(BaseUserManager): 
       def create_user(self, email, password=None): 
              if not email: 
                     raise ValueError("Users must have an email address") 
              email = self.normalize_email(email) 
              user = self.model(email=email) 
              user.set_password(password) 
              user.save(using=self._db) 
              return user 
 
       def create_superuser(self, email, password): 
        user = self.create_user(email, password) 
        user.is_admin = True 
        User.is_superuser = True 
        user.save(using=self._db) 
        return user 
 
class User(AbstractBaseUser): 
    email = models.EmailField(unique=True) 
    name = models.CharField(max_length =255) 
    is_active = models.BooleanField(default=True) 
    is_admin = models.BooleanField(default=False) 
    objects = UserManager() 
    USERNAME_FIELD = 'email'


class MovieList(models.Model):
     title=models.CharField(max_length=100)
     desc=models.TextField()
     thumb=models.FileField(null=True,upload_to='thumbnail/')
     video=models.FileField(null=True,upload_to='video/')
     count=models.IntegerField(default=0)

class history(models.Model):
     user=models.ForeignKey(User,on_delete=models.CASCADE)
     movie=models.ForeignKey(MovieList,on_delete=models.CASCADE)
     date=models.DateTimeField(auto_now=True)


class Watchlist(models.Model):
     user=models.ForeignKey(User,on_delete=models.CASCADE)
     movie=models.ForeignKey(MovieList,on_delete=models.CASCADE)






     



     
