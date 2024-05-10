class FeedbackUpdateMsg():
    feedbackId: int
    name: str
    size: int
    image: bytes

    def __init__(self, msgInstance: dict):
        self.guideId = msgInstance['feedbackId']
        self.name = msgInstance['name']
        self.size = msgInstance['size']
        self.image = msgInstance['image']