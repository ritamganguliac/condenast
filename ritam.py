import asyncio
from aiosmtpd.controller import Controller

class CustomSMTPHandler:
    async def handle_DATA(self, server, session, envelope):
        print('Message from:', envelope.mail_from)
        print('Message for:', envelope.rcpt_tos)
        print('Message data:\n', envelope.content.decode())
        return '250 OK'

async def main():
    controller = Controller(CustomSMTPHandler(), hostname='localhost', port=1025)
    controller.start()
    print('SMTP server started on localhost:1025')
    await asyncio.sleep(3600)  # Keep the server running for an hour

if __name__ == '__main__':
    asyncio.run(main())
