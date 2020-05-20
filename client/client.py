#!/usr/bin/python
import requests
import subprocess
import json
import time
import os
import socket

HN=socket.gethostname()


if __name__ == "__main__":

    print("Demarrage du client GPAO")
    print("Hostname : ", HN)

    url_api = os.getenv('URL_API', 'localhost')

    print(url_api)

    req=requests.put('http://'+url_api+':8080/api/cluster?host='+HN)
    id_cluster = req.json()[0]['id']
    print(id_cluster)

    while True:
        print("Recherche d'un nouveau job")
        req=requests.get('http://'+url_api+':8080/api/job/ready?id_cluster='+str(id_cluster))
        #print (req.json())
        if(len(req.json())!=0):
            id = req.json()[0]['id']
            command = req.json()[0]['command']

            print("L'identifiant du job "+str(id)+" est disponible")

            print("Execution de la commande "+ str(command))
            array_command = command.split()
            returnCode = 999
            try:
                proc = subprocess.Popen(array_command, stdout=subprocess.PIPE)
                (out, err) = proc.communicate()
                status='done'
                returnCode = proc.returncode
                json_data = out.decode()

            except Exception as ex:
                status='failed'
                json_data=str(ex)
                print('failed', ex)
            
            if (returnCode != 0):
                status='failed'
                print("le job a echoue")

            req=requests.post('http://'+url_api+':8080/api/job?id='+str(id)+'&status='+str(status)+'&returnCode='+str(returnCode), json={"log": json_data})
        else:
            print("Aucun job disponible dans la base")

        time.sleep(5)
