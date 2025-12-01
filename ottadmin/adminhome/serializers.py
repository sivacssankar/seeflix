from rest_framework import serializers
from .models import MovieList,Watchlist,history,User

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieList
        fields = '__all__'



class WatchlistSerializer(serializers.ModelSerializer):
    movie=MovieSerializer(read_only=True)
    class Meta:
        model = Watchlist
        fields = '__all__'

class historyserializer(serializers.ModelSerializer):
    movie=MovieSerializer(read_only=True)
    class Meta:
        model=history
        fields = '__all__'




class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'