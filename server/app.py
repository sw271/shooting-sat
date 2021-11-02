from ariadne.asgi import GraphQL
from api.schema import schema


app = GraphQL(schema, debug=True)
