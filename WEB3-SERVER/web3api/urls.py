from django.urls import path
from . import views

urlpatterns = [
    path('', views.hello_world, name='hello_world'),
    path('api/', views.index, name='index'),
    path('hotm/<int:id>', views.hotm, name='hotm'),
    path('uri/<str:contract>/<int:id>', views.uri, {}, name='uri'),
    path('uri/<str:contract>/supply', views.supply, {}, name='supply'),

]