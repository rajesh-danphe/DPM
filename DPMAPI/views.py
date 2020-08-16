from django.shortcuts import render, HttpResponseRedirect
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import csrf_protect
import numpy as np

np.set_printoptions(suppress=True)
import pandas as pd
from sklearn.cluster import KMeans
import json
import os
from os import path

# @csrf_protect
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def centroids(request):
  if request.method == 'POST':
    n_clusters = request.GET['n_clusters']
    iterate = request.GET['iterate']
    tolerance = request.GET['tolerance']
    random_state = request.GET['random_state']
    file = request.FILES['uploadFile']
    data = pd.read_csv(file).replace(np.nan, 0)
    dirName = os.path.join(BASE_DIR, 'DPMAPI/static/Files')
    if (path.exists(dirName)):
      isPresent = path.exists(os.path.join(dirName, "U1TrainFile.csv"))
      if (isPresent):
        os.remove(os.path.join(dirName, "U1TrainFile.csv"))
        data.to_csv(os.path.join(dirName, "U1TrainFile.csv"), index=False)
      else:
        data.to_csv(os.path.join(dirName, "U1TrainFile.csv"), index=False)
    else:
      os.mkdir(dirName)
      data.to_csv(os.path.join(dirName, "U1TrainFile.csv"), index=False)
    # isPresent = path.exists(os.path.join(dirName, "U1TrainFile.csv"))

    column = list(data.columns)
    kmeans = KMeans(n_clusters=int(n_clusters), init='random', max_iter=int(iterate), tol=float(tolerance),
                    random_state=int(random_state)).fit(data)
    mydata = np.array(data)
    centroids = (kmeans.cluster_centers_)
    df = pd.DataFrame(centroids)
    result = df.to_json(orient="values")
    parsed = json.loads(result)
    json_data = []
    json_data.append(column)
    data = []
    for row in parsed:
      data.append(dict(zip(column, row)))
    json_data.append(data)
    return JsonResponse(json_data, safe=False)


# @csrf_protect
def predicted(request):
  if request.method == 'POST':
    n_clusters = request.GET['n_clusters']
    iterate = request.GET['iterate']
    tolerance = request.GET['tolerance']
    random_state = request.GET['random_state']
    trainFile = os.path.join(BASE_DIR, 'DPMAPI/static/Files/U1TrainFile.csv')
    testFile = request.FILES['testFile']
    trainData = pd.read_csv(trainFile).replace(np.nan, 0)
    kmeans = KMeans(n_clusters=int(n_clusters), init='random', max_iter=int(iterate), tol=float(tolerance),
                    random_state=int(random_state)).fit(trainData)
    testdata = pd.read_csv(testFile).replace(np.nan, 0)
    testdata.index.name = 'id'
    predicted = kmeans.predict(testdata)
    predicteddf = pd.DataFrame(data=predicted.flatten())
    predicteddf.index.name = 'id'
    final = pd.merge(predicteddf, testdata, on='id')
    column = list(final.columns)
    # final.to_csv("E:\\ShivSirProject\\Files\\Predicted.csv")
    df = pd.DataFrame(final)
    result = df.to_json(orient="values")
    parsed = json.loads(result)
    json_data = []
    json_data.append(column)
    data = []
    for row in parsed:
      data.append(dict(zip(column, row)))
    json_data.append(data)
    return JsonResponse(json_data, safe=False)
