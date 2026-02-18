import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class EmailService:
    def send_summary(self, to_email: str, stats: dict):
        if not settings.SMTP_HOST or not settings.SMTP_USER:
            logger.warning("SMTP settings not configured. Skipping email.")
            return

        msg = MIMEMultipart()
        msg["From"] = f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL}>"
        msg["To"] = to_email
        msg["Subject"] = "Text Processing Summary"

        body = f"""
        <h1>Processing Summary</h1>
        <p>Here are your processing statistics:</p>
        <ul>
            <li>Total Records Processed: {stats.get('total', 0)}</li>
            <li>Average Sentiment: {stats.get('avg_sentiment', 0.0):.2f}</li>
        </ul>
        """
        msg.attach(MIMEText(body, "html"))

        try:
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                if settings.SMTP_TLS:
                    server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.send_message(msg)
            logger.info(f"Email sent to {to_email}")
        except Exception as e:
            logger.error(f"Failed to send email: {e}")

email_service = EmailService()
