#!/usr/bin/env python

# Required Python packages:
# * http://python-requests.org/

import os
import requests
import json
import argparse


def updateLatitudeData(destdir, userid):
    dirname = "%s/%s" % (destdir, userid)
    # Does user directory exist? If no, create it
    if not os.path.isdir(dirname):
        os.makedirs(dirname)
    # Get json data from latitude
    baseurl="https://www.google.com/latitude/apps/badge/api?user=%s&type=json"
    url=baseurl % userid
    r = requests.get(url)
    # data = r.json()
    data = json.loads(r.text)
    #print(data['features'][0]['geometry'])
    #print(data['features'][0]['properties']['timeStamp'])
    # If data is new: Write data
    timestamp = data['features'][0]['properties']['timeStamp']
    filename = "%s/%s.json" % (dirname, timestamp)
    if not os.path.isfile(filename):
        f = open(filename, 'w')
        f.write(r.text.encode('utf8'))


parser = argparse.ArgumentParser(description="Download latest latitude data of given users.")
parser.add_argument("-d", "--destdir", help="Destination directory", default=".")
parser.add_argument("-f", "--file", help="Input file")
parser.add_argument("userid", nargs="*")
args = parser.parse_args()

# Iterate over user ids from parameters
if (args.userid):
    for id in args.userid:
        updateLatitudeData(args.destdir, id)
# Iterate ofer user ids from file
if (args.file):
    f = open(args.file, 'r')
    for id in f:
        id = id.rstrip()
        if len(id)>0:
            updateLatitudeData(args.destdir, id)

# vim: ai ts=4 sts=4 et sw=4 ft=python
