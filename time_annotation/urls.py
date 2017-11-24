from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^request/$', views.request, name='request'),
    url(r'^request_novel/$', views.request_novel, name='request_novel'),
    url(r'^retrieve_novel/$', views.retrieve_novel, name='retrieve_novel'),
    url(r'^retrieve_novel2/$', views.retrieve_novel2, name='retrieve_novel2'),
    url(r'^save/$', views.save, name='save'),
    url(r'^return_data/$', views.return_data, name='return_data'),
    url(r'^step1/$', views.step1, name='step1'),
    url(r'^step2/$', views.step2, name='step2'),
    url(r'^putter/$', views.putter, name='putter'),
    url(r'^putter_tutorial/$', views.putter_tutorial, name='putter_tutorial'),
    url(r'^flag_comparison/$', views.flag_comparison, name='flag_comparison'),
    url(r'^brute_comparison/$', views.brute_comparison, name='brute_comparison'),
    url(r'^putter_return_data/$', views.putter_return_data, name='putter_return_data'),
    url(r'^flag_comparison_return_data/$', views.flag_comparison_return_data, name='flag_comparison_return_data'),
    url(r'^brute_comparison_return_data/$', views.brute_comparison_return_data, name='brute_comparison_return_data'),
    url(r'^retrieve_important_event/$', views.retrieve_important_event, name='retrieve_important_event'),
    url(r'^retrieve_important_event_in_same_group/$', views.retrieve_important_event_in_same_group, name='retrieve_important_event_in_same_group'),
    url(r'^retrieve_event_in_same_group_brute/$', views.retrieve_event_in_same_group_brute, name='retrieve_event_in_same_group_brute'),

]
