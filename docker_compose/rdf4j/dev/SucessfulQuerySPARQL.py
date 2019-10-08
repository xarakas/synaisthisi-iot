# localhost:8083/rdf4j-server/
# localhowt:8083/rdf4j-workbench

import requests
import json
import sys

if(len(sys.argv)<=1):
        query = 'PREFIX sm:<http://127.0.0.1/ontology/ServiceModel.owl#> SELECT DISTINCT ?service WHERE { ?service rdfs:subClassOf sm:Service . }' 
else:
	query = sys.argv[1]

endpoint = "http://localhost:8083/rdf4j-server/repositories/1"

print("POSTing SPARQL query to %s" % (endpoint))
params = { 'query': query }
headers = { 
  'content-type': 'application/x-www-form-urlencoded', 
  'accept': 'application/sparql-results+json' 
}

r = requests.post(endpoint, data=params, headers=headers)

content = r.content

print("Response Status %s" % r.status_code)
print("Response Reason %s" % r.reason)
# results = json.loads(content)
results = r.json()
print(results)
print("\nHUMAN READABLE\n")
heads = results['head']['vars'] 
print(heads)
#print(results['results']['bindings'])
for b in heads:
	print(b)
	print("----------")
	for a in results['results']['bindings']:
		if '#' in a[b]['value']:
			print(a[b]['value'].split('#')[1])
		else:
			print(a[b]['value'])




# Get all available resources
# PREFIX rm:<http://127.0.0.1/ontology/ResourceModel.owl#> SELECT DISTINCT ?resource WHERE { ?resource rdfs:subClassOf rm:Resource . }

# Get all available services
# PREFIX sm:<http://127.0.0.1/ontology/ServiceModel.owl#> SELECT DISTINCT ?service WHERE { ?service rdfs:subClassOf sm:Service . }

# Get all available resource types
# PREFIX rm:<http://127.0.0.1/ontology/ResourceModel.owl#> SELECT DISTINCT ?resource WHERE { ?resource rdf:type rm:ResourceType . }

# Get all available devices (empty?)
# PREFIX dm:<http://127.0.0.1/ontology/DeviceModel.owl#> SELECT DISTINCT ?device WHERE { ?device rdfs:subClassOf dm:Device . } 

# Get attributes of Service
# PREFIX sm:<http://127.0.0.1/ontology/ServiceModel.owl#> SELECT DISTINCT ?p WHERE {?p rdfs:domain sm:Service .}

# Get attributes of Resource
# PREFIX rm:<http://127.0.0.1/ontology/ResourceModel.owl#> SELECT DISTINCT ?p WHERE {?p rdfs:domain rm:Resource .}

# Get attributes of Location
# PREFIX rm:<http://127.0.0.1/ontology/ResourceModel.owl#> SELECT DISTINCT ?p WHERE {?p rdfs:domain rm:Location .}

# Get range of "hasName" attributes
# PREFIX rm:<http://127.0.0.1/ontology/ResourceModel.owl#> SELECT DISTINCT ?p WHERE {rm:hasName rdfs:range ?p .}



#print(results['results']['bindings'])
#print("\n".join([result['type']['value'] for result in results['results']['bindings']]))
