class FeedbackUpdateMsg():
    feedbackId: int
    name: str
    size: int
    image: bytes

    def __init__(self, msgInstance: dict):
        print("피드백 dict -> 객체", str(msgInstance))
        self.feedbackId = msgInstance['id']
        self.name = msgInstance['name']
        self.size = msgInstance['size']
        self.image = msgInstance['image']