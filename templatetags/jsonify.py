from django import template
import json

register = template.Library()

@register.filter(is_safe=True)
def to_json(value):
    return json.dumps(value)
