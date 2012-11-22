# Create your views here.
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
import urllib2
from BeautifulSoup import BeautifulStoneSoup
from forms import URLForm
import time
import sys


def index(request):
    if request.method == 'POST':
        form = URLForm(request.POST)
        if form.is_valid():
            xml_url = form.cleaned_data["url"]
            redirect_url = reverse("heartbeatmatch.views.track") + "?url=" + urllib2.quote(xml_url)
            return HttpResponseRedirect(redirect_url)
        else:
            return render_to_response('hbm-index.html', {'URLForm': form}, context_instance=RequestContext(request))
    else:
        return render_to_response('hbm-index.html', {'URLForm': URLForm()}, context_instance=RequestContext(request))


def track(request, url=""):
    params = {}
    params["url"] = url
    if 'url' in request.GET and urllib2.unquote(request.GET['url']).index("http://connect.garmin.com/activity") != -1:
        url = urllib2.unquote(request.GET['url'])
        params["url"] = url
        activity = url.split("/")[4][:9]
        tcx_url = "http://connect.garmin.com/proxy/activity-service-1.1/tcx/activity/" + activity + "?full=true"
        print tcx_url
        page = urllib2.urlopen(tcx_url)
        params["track"] = parseXML(page)
    else:
        params["error"] = "Your URL wasn't a valid Garmin Connect URL"
    return render_to_response('hbm-track.html', params, context_instance=RequestContext(request))


def parseXML(page):
    timeformat = '%Y-%m-%dT%H:%M:%S.000Z'
    soup = BeautifulStoneSoup(page)
    track = {}
    startTime = time.mktime(time.strptime(soup.find('id').getText(), timeformat))
    track["starttime"] = soup.find('id').getText()
    trackpoints = []
    averageHeartrate = 0
    maxHeartrate = 0
    track["activityType"] = soup.find("activity")["sport"]
    for trackpoint in soup.findAll("trackpoint"):
        try:
            if trackpoint.find("latitudedegrees") and trackpoint.find("longitudedegrees"):
                timestring = trackpoint.find("time").getText()
                timestamp = time.mktime(time.strptime(timestring, timeformat))
                timedelta = float((timestamp - startTime))
                heartrate = int(trackpoint.find("heartratebpm").getText())
                averageHeartrate = averageHeartrate + heartrate
                if maxHeartrate < heartrate:
                    maxHeartrate = heartrate
                point = {"time": timestring, "timedelta": timedelta, "heartrate": heartrate, "lat": trackpoint.find("latitudedegrees").getText(), "lon": trackpoint.find("longitudedegrees").getText()}
                trackpoints.append(point)
        except Exception:
            print "Unexpected error:", sys.exc_info()[0]
    track["trackpoints"] = trackpoints
    averageHeartrate = averageHeartrate / len(trackpoints)
    track["duration"] = trackpoints[len(trackpoints) - 1]["timedelta"]
    track["maxHeartrate"] = maxHeartrate
    track["averageHeartrate"] = averageHeartrate
    track["heartbeats"] = averageHeartrate * track["duration"] / 60
    return track
