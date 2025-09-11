import pytest
from django.urls import reverse

@pytest.mark.django_db
def test_healthcheck(client):
    url = reverse("healthcheck")  # eğer healthcheck endpoint varsa
    response = client.get(url)
    assert response.status_code == 200
