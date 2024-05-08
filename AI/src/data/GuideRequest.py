from typing_extensions import Unpack
from pydantic import BaseModel, ConfigDict

class GuideUpdateRequest(BaseModel):
    guideId: int
    name: str
    size: int
    image: bytes