from django import forms


class URLForm(forms.Form):
    url = forms.URLField(label='',
        required='True',
        widget=forms.TextInput({"placeholder": "URL to a garmin connect activity"})
        )
    default_data = {'url': 'http://'}

    def clean(self):
        cleaned_data = super(URLForm, self).clean()
        url = cleaned_data.get('url')
        if not url and url.index("http://connect.garmin.com/activity") != -1:
            self._errors["url"] = self.error_class(["You must enter a Garmin Connect url"])
        return cleaned_data
