from ariadne import make_executable_schema
from .type_defs import type_defs
from .query import query

schema = make_executable_schema(type_defs, query)
