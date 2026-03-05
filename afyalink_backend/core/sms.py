import base64
import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

SMSLEOPARD_ENDPOINT = "https://api.smsleopard.com/v1/sms/send"

def _get_auth_header():
    api_key = settings.SMSLEOPARD_API_KEY
    api_secret = settings.SMSLEOPARD_API_SECRET
    credentials = f"{api_key}:{api_secret}"
    encoded = base64.b64encode(credentials.encode()).decode()
    return {
        "Authorization": f"Basic {encoded}",
        "Content-Type": "application/json",
    }

def _normalise_number(phone: str) -> str:
    phone = phone.strip().replace(" ", "").replace("-", "")
    if phone.startswith("+"):
        phone = phone[1:]
    if phone.startswith("0"):
        phone = "254" + phone[1:]
    return phone

def send_sms(phone: str, message: str) -> dict:
    number = _normalise_number(phone)
    payload = {
        "source": settings.SMSLEOPARD_SENDER_ID,
        "message": message,
        "destination": [{"number": number}],
    }
    try:
        resp = requests.post(SMSLEOPARD_ENDPOINT, json=payload, headers=_get_auth_header(), timeout=15)
        data = resp.json()
        success = resp.status_code == 200 and data.get("success", False)
        if success:
            logger.info("SMS sent to %s", number)
        else:
            logger.warning("SMS send failed to %s: %s %s", number, resp.status_code, data)
        return {"success": success, "message": data.get("message", ""), "raw": data}
    except requests.Timeout:
        logger.error("SMS request timed out for %s", number)
        return {"success": False, "message": "SMS gateway timed out.", "raw": {}}
    except Exception as exc:
        logger.exception("SMS unexpected error: %s", exc)
        return {"success": False, "message": str(exc), "raw": {}}

def send_bulk_sms(phone_numbers: list[str], message: str) -> dict:
    if not phone_numbers:
        return {"success": False, "message": "No recipients provided.", "sent": 0, "total": 0, "raw": {}}
    destination = [{"number": _normalise_number(p)} for p in phone_numbers]
    payload = {
        "source": settings.SMSLEOPARD_SENDER_ID,
        "message": message,
        "destination": destination,
    }
    try:
        resp = requests.post(SMSLEOPARD_ENDPOINT, json=payload, headers=_get_auth_header(), timeout=30)
        data = resp.json()
        success = resp.status_code == 200 and data.get("success", False)
        return {
            "success": success,
            "sent": len(phone_numbers) if success else 0,
            "total": len(phone_numbers),
            "message": data.get("message", ""),
            "raw": data,
        }
    except requests.Timeout:
        return {"success": False, "message": "SMS gateway timed out.", "sent": 0, "total": len(phone_numbers), "raw": {}}
    except Exception as exc:
        return {"success": False, "message": str(exc), "sent": 0, "total": len(phone_numbers), "raw": {}}

def send_appointment_reminder(phone: str, patient_name: str, date_str: str, facility: str) -> dict:
    message = f"Hello {patient_name}, you have an appointment at {facility} on {date_str}. Reply YES to confirm or NO to reschedule. — AFYALINK"
    return send_sms(phone, message)

def send_medication_reminder(phone: str, patient_name: str, medication: str) -> dict:
    message = f"Hi {patient_name}, this is a reminder to take your {medication} as prescribed. Stay healthy! — AFYALINK"
    return send_sms(phone, message)

def send_followup_reminder(phone: str, patient_name: str, facility: str) -> dict:
    message = f"Hi {patient_name}, please visit {facility} for your follow-up appointment. Your care team is ready for you. — AFYALINK"
    return send_sms(phone, message)
