# Create your views here.
from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('heartbeatmatch.views',
    url(r'^$', 'index'),
    url('track[/]?$', 'track', name="track"),
)
