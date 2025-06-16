from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    CAMARA_API_URL: str = "https://dadosabertos.camara.leg.br/api/v2"
    SENADO_API_URL: str = "https://legis.senado.leg.br/dadosabertos/senador"

    class Config:
        env_file = ".env"

settings = Settings() 