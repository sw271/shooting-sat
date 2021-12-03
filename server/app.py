from ariadne.asgi import GraphQL
from starlette.middleware.cors import CORSMiddleware
from api.schema import schema
from ariadne.contrib.tracing.apollotracing import ApolloTracingExtension

app = CORSMiddleware(
  GraphQL(
    schema,
    debug=True,
    extensions=[ApolloTracingExtension],
  ),
  allow_origins=['*'],
  allow_methods=("GET", "POST", "OPTIONS")
)
