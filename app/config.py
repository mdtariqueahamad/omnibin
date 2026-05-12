# pyrefly: ignore [missing-import]
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    mongodb_uri: str = "mongodb+srv://mdtariqbist_db_user:MongoAtlas%40786@cluster.chluorm.mongodb.net/?appName=Cluster"
    mongodb_db_name: str = "omnibin"
    mqtt_broker_host: str = "localhost"
    mqtt_broker_port: int = 1883
    mqtt_topic: str = "omnibin/bins/fill_level"

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )


settings = Settings()
