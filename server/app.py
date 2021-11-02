from ariadne.asgi import GraphQL
from starlette.middleware.cors import CORSMiddleware
from api.schema import schema

app = CORSMiddleware(GraphQL(schema, debug=True), allow_origins=[
                     '*'], allow_methods=("GET", "POST", "OPTIONS"))
