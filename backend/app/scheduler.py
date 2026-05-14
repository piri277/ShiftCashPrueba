from apscheduler.schedulers.background import BackgroundScheduler
from datetime import date
from .database import SessionLocal
from .models import Transaction

def _toca_hoy(t, hoy: date) -> bool:
    if not t.trans_date or hoy < t.trans_date:
        return False
    if t.frequency == "monthly":
        return hoy.day == t.trans_date.day
    if t.frequency == "weekly":
        return hoy.weekday() == t.trans_date.weekday()
    if t.frequency == "biweekly":
        return (hoy - t.trans_date).days % 14 == 0
    if t.frequency == "annual":
        return hoy.day == t.trans_date.day and hoy.month == t.trans_date.month
    return False

def registrar_recurrentes():
    db = SessionLocal()
    hoy = date.today()
    try:
        recurrentes = db.query(Transaction).filter_by(is_recurring=True).all()
        for t in recurrentes:
            if not _toca_hoy(t, hoy):
                continue
            ya_existe = db.query(Transaction).filter(
                Transaction.user_id      == t.user_id,
                Transaction.category_id  == t.category_id,
                Transaction.amount       == t.amount,
                Transaction.trans_date   == hoy,
                Transaction.is_recurring == False,
            ).first()
            if ya_existe:
                continue
            db.add(Transaction(
                user_id      = t.user_id,
                category_id  = t.category_id,
                type         = t.type,
                amount       = t.amount,
                description  = t.description,
                trans_date   = hoy,
                is_recurring = False,
                frequency    = None,
            ))
        db.commit()
    finally:
        db.close()

scheduler = BackgroundScheduler()
scheduler.add_job(registrar_recurrentes, "cron", hour=0, minute=5)
scheduler.start()