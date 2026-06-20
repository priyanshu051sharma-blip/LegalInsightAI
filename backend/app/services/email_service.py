"""
Email Notification Service

Handles:
- Analysis completion notifications
- Team member invitations
- Password reset emails
- Report sharing
- Batch processing notifications
"""

from typing import Dict, List, Optional, Any
from datetime import datetime
import asyncio
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from abc import ABC, abstractmethod


class EmailTemplate(ABC):
    """Base class for email templates"""

    @abstractmethod
    def get_subject(self) -> str:
        """Get email subject"""
        pass

    @abstractmethod
    def get_html_body(self) -> str:
        """Get HTML email body"""
        pass

    @abstractmethod
    def get_text_body(self) -> str:
        """Get plain text email body"""
        pass


class AnalysisCompleteEmail(EmailTemplate):
    """Email for analysis completion"""

    def __init__(self, user_name: str, document_title: str, 
                 risk_score: float, dashboard_url: str):
        self.user_name = user_name
        self.document_title = document_title
        self.risk_score = risk_score
        self.dashboard_url = dashboard_url

    def get_subject(self) -> str:
        return f"✅ Analysis Complete: {self.document_title}"

    def get_html_body(self) -> str:
        risk_level = "CRITICAL" if self.risk_score >= 75 else "HIGH" if self.risk_score >= 50 else "MEDIUM" if self.risk_score >= 25 else "LOW"
        risk_color = "#c53030" if self.risk_score >= 75 else "#f6ad55" if self.risk_score >= 50 else "#ecc94b" if self.risk_score >= 25 else "#38a169"
        
        return f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2>Document Analysis Complete</h2>
                    <p>Hi {self.user_name},</p>
                    
                    <p>Your analysis for <strong>{self.document_title}</strong> has been completed!</p>
                    
                    <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>Analysis Results</h3>
                        <p style="margin: 10px 0;">
                            <strong>Risk Score:</strong> 
                            <span style="color: {risk_color}; font-size: 24px; font-weight: bold;">
                                {self.risk_score}/100 ({risk_level})
                            </span>
                        </p>
                    </div>
                    
                    <p>
                        <a href="{self.dashboard_url}" 
                           style="background-color: #2d3748; color: white; padding: 12px 24px; 
                                  text-decoration: none; border-radius: 4px; display: inline-block;">
                            View Full Report
                        </a>
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                    
                    <p style="font-size: 12px; color: #718096;">
                        © Legal Assistant Platform | 
                        <a href="https://example.com/privacy" style="color: #2d3748;">Privacy Policy</a>
                    </p>
                </div>
            </body>
        </html>
        """

    def get_text_body(self) -> str:
        return f"""
Document Analysis Complete

Hi {self.user_name},

Your analysis for "{self.document_title}" has been completed!

Risk Score: {self.risk_score}/100

View your full report: {self.dashboard_url}

© Legal Assistant Platform
        """


class TeamInvitationEmail(EmailTemplate):
    """Email for team member invitations"""

    def __init__(self, invitee_name: str, inviter_name: str, 
                 organization: str, invitation_link: str):
        self.invitee_name = invitee_name
        self.inviter_name = inviter_name
        self.organization = organization
        self.invitation_link = invitation_link

    def get_subject(self) -> str:
        return f"You've been invited to join {self.organization} on Legal Assistant"

    def get_html_body(self) -> str:
        return f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2>You're Invited!</h2>
                    <p>Hi {self.invitee_name},</p>
                    
                    <p><strong>{self.inviter_name}</strong> has invited you to join 
                    <strong>{self.organization}</strong> on Legal Assistant.</p>
                    
                    <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p>Legal Assistant helps law firms analyze documents, detect risks, and ensure compliance.</p>
                    </div>
                    
                    <p>
                        <a href="{self.invitation_link}" 
                           style="background-color: #2d3748; color: white; padding: 12px 24px; 
                                  text-decoration: none; border-radius: 4px; display: inline-block;">
                            Accept Invitation
                        </a>
                    </p>
                    
                    <p style="font-size: 12px; color: #718096;">
                        This invitation is valid for 7 days.
                    </p>
                </div>
            </body>
        </html>
        """

    def get_text_body(self) -> str:
        return f"""
You're Invited!

Hi {self.invitee_name},

{self.inviter_name} has invited you to join {self.organization} on Legal Assistant.

Accept Invitation: {self.invitation_link}

This invitation is valid for 7 days.
        """


class PasswordResetEmail(EmailTemplate):
    """Email for password reset"""

    def __init__(self, user_name: str, reset_link: str):
        self.user_name = user_name
        self.reset_link = reset_link

    def get_subject(self) -> str:
        return "Reset Your Legal Assistant Password"

    def get_html_body(self) -> str:
        return f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2>Password Reset</h2>
                    <p>Hi {self.user_name},</p>
                    
                    <p>You requested a password reset for your Legal Assistant account.</p>
                    
                    <p style="color: #c53030;">
                        <strong>⚠️ This link will expire in 1 hour.</strong>
                    </p>
                    
                    <p>
                        <a href="{self.reset_link}" 
                           style="background-color: #2d3748; color: white; padding: 12px 24px; 
                                  text-decoration: none; border-radius: 4px; display: inline-block;">
                            Reset Password
                        </a>
                    </p>
                    
                    <p style="font-size: 12px; color: #718096;">
                        If you didn't request this, please ignore this email.
                    </p>
                </div>
            </body>
        </html>
        """

    def get_text_body(self) -> str:
        return f"""
Password Reset

Hi {self.user_name},

You requested a password reset for your Legal Assistant account.

⚠️ This link will expire in 1 hour.

Reset Password: {self.reset_link}

If you didn't request this, please ignore this email.
        """


class EmailService:
    """Send emails with templates"""

    def __init__(self, smtp_host: str = "smtp.gmail.com", smtp_port: int = 587,
                 sender_email: str = "", sender_password: str = ""):
        self.smtp_host = smtp_host
        self.smtp_port = smtp_port
        self.sender_email = sender_email
        self.sender_password = sender_password
        self.queue: List[Dict[str, Any]] = []

    async def send_email(self, to_email: str, template: EmailTemplate,
                        is_html: bool = True) -> bool:
        """Send email using template"""
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = template.get_subject()
            msg["From"] = self.sender_email
            msg["To"] = to_email
            
            # Attach plain text
            msg.attach(MIMEText(template.get_text_body(), "plain"))
            
            # Attach HTML
            if is_html:
                msg.attach(MIMEText(template.get_html_body(), "html"))
            
            # Send email asynchronously
            asyncio.create_task(self._send_smtp(to_email, msg.as_string()))
            return True
            
        except Exception as e:
            print(f"Error sending email to {to_email}: {e}")
            return False

    async def _send_smtp(self, to_email: str, message: str):
        """Send via SMTP (non-blocking)"""
        try:
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None,
                self._smtp_send,
                to_email,
                message
            )
        except Exception as e:
            print(f"SMTP error: {e}")

    def _smtp_send(self, to_email: str, message: str):
        """Blocking SMTP send"""
        try:
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.sendmail(self.sender_email, to_email, message)
        except Exception as e:
            print(f"SMTP send failed: {e}")

    async def send_analysis_complete(self, to_email: str, user_name: str,
                                     document_title: str, risk_score: float,
                                     dashboard_url: str) -> bool:
        """Send analysis completion email"""
        template = AnalysisCompleteEmail(
            user_name=user_name,
            document_title=document_title,
            risk_score=risk_score,
            dashboard_url=dashboard_url
        )
        return await self.send_email(to_email, template)

    async def send_team_invitation(self, to_email: str, invitee_name: str,
                                  inviter_name: str, organization: str,
                                  invitation_link: str) -> bool:
        """Send team invitation email"""
        template = TeamInvitationEmail(
            invitee_name=invitee_name,
            inviter_name=inviter_name,
            organization=organization,
            invitation_link=invitation_link
        )
        return await self.send_email(to_email, template)

    async def send_password_reset(self, to_email: str, user_name: str,
                                 reset_link: str) -> bool:
        """Send password reset email"""
        template = PasswordResetEmail(
            user_name=user_name,
            reset_link=reset_link
        )
        return await self.send_email(to_email, template)


# Global email service instance
email_service = EmailService()
