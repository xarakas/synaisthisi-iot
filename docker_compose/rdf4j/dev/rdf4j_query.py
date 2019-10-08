import requests
import json


class Rdf4j:

    query = 'PREFIX sm:<http://127.0.0.1/ontology/ServiceModel.owl#> SELECT DISTINCT ?service WHERE { ?service rdfs:subClassOf sm:Service . }' 
    url = "http://localhost:8083/rdf4j-server/repositories/1"
    params = { 'query': query }
    headers = { 
    'content-type': 'application/x-www-form-urlencoded', 
    'accept': 'application/sparql-results+json' 
    }

    def query_store(self):
        try:
            r = requests.post(self.url, data=self.params, headers=self.headers, timeout=0.5)
            if r.ok:
                self.data = r.json()
            return r.ok
        except requests.ConnectionError:
            print('Connection Error')
            return False
        except requests.Timeout:
            print('Our request is taking too long...')
            return False
    
    def get_services(self):
        heads = self.data['head']['vars']
        for b in heads:
                for a in self.data['results']['bindings']:
                    if '#' in a[b]['value']:
                        yield(a[b]['value'].split('#')[1])
                    else:
                        yield(a[b]['value'])
        # except ValueError as ex: # json() error


rdf4j = Rdf4j()
if(rdf4j.query_store()):
    for service in rdf4j.get_services():
        print(service)
else:
    print('Oh dear we failed...')