#!/usr/bin/env python

import requests
import json
import os.path

userid=288995578852599064
baseurl="https://www.google.com/latitude/apps/badge/api?user=%d&type=json"

url=baseurl % userid
r = requests.get(url)
# data = r.json()
data = json.loads(r.text)

#print(data['features'][0]['geometry'])
#print(data['features'][0]['properties']['timeStamp'])

timestamp = data['features'][0]['properties']['timeStamp']
filename = "%d-%s.json" % (userid, timestamp)

if not os.path.isfile(filename):
    f = open(filename, 'w')
    f.write(r.text)

# vim: ai ts=4 sts=4 et sw=4 ft=python
