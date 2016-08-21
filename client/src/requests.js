'use strict';

export function doGet(apiUrl){
  return new Promise((resolve, reject) => {
    var url = apiUrl.replace(/^\/*/, '/');
    var httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function() {
      var response = httpRequest.response;
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        try {
          response = JSON.parse(httpRequest.response);
        } catch (e) {
          console.log('Non json resieved:', response);
        }

        if (200 <= httpRequest.status && httpRequest.status < 300) {
          resolve(response, httpRequest.status);
        } else {
          reject(response, httpRequest.status);
        }
      }
    };


    httpRequest.open('GET', url);
    httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    httpRequest.setRequestHeader("Accept", "application/json;charset=UTF-8");

    httpRequest.send();

  });
}

export function doPost(apiUrl, data){
  return new Promise((resolve, reject) => {
    var url = apiUrl.replace(/^\/*/, '/');
    var httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function() {
      var response = httpRequest.response;

      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        try {
          response = JSON.parse(httpRequest.response);
        } catch (e) {
          console.log('Non json resieved:', response);
        }

        if (200 <= httpRequest.status && httpRequest.status < 300) {
          resolve(response, httpRequest.status);
        } else {
          reject(response, httpRequest.status);
        }
      }
    };


    httpRequest.open('POST', url);
    httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    httpRequest.setRequestHeader("Accept", "application/json;charset=UTF-8");

    httpRequest.send(JSON.stringify(data));

  });
}
