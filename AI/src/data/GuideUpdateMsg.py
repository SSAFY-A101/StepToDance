class GuideUpdateMsg():
    guideId: int
    name: str
    size: int
    image: bytes

    def __init__(self, msgInstance: dict):
        print("가이드 dict -> 객체", str(msgInstance))
        self.guideId = msgInstance['id']
        self.name = msgInstance['name']
        self.size = msgInstance['size']
        self.image = msgInstance['image']