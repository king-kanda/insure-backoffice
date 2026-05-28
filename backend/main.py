import os
import uuid
import base64
import shutil
from datetime import datetime, timedelta
from typing import Optional

from fastapi import FastAPI, Header, HTTPException, UploadFile, File, Form, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, String, Float, DateTime, Integer, event
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# ── Database setup ────────────────────────────────────────────────────────────

DATABASE_URL = "sqlite:///./wayyo.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Enable WAL mode for better concurrency on SQLite
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_conn, _):
    cursor = dbapi_conn.cursor()
    cursor.execute("PRAGMA journal_mode=WAL")
    cursor.close()

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ── Models ────────────────────────────────────────────────────────────────────

class Customer(Base):
    __tablename__ = "customers"
    id           = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name         = Column(String, nullable=False)
    kra_pin      = Column(String, unique=True, index=True, nullable=False)
    id_number    = Column(String, nullable=False)
    phone        = Column(String, default="")
    email        = Column(String, default="")
    address      = Column(String, default="")
    status       = Column(String, default="active")
    created_at   = Column(DateTime, default=datetime.utcnow)

class Policy(Base):
    __tablename__ = "policies"
    id             = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    policy_number  = Column(String, unique=True, index=True, nullable=False)
    customer_id    = Column(String, nullable=True)
    customer_name  = Column(String, default="")
    cover_type     = Column(String, default="motor")
    start_date     = Column(String, default="")
    expiry_date    = Column(String, default="")
    premium        = Column(Float, default=0.0)
    status         = Column(String, default="active")
    created_at     = Column(DateTime, default=datetime.utcnow)

class Claim(Base):
    __tablename__ = "claims"
    id             = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    claim_id       = Column(String, unique=True, index=True, nullable=False)
    customer_id    = Column(String, nullable=True)
    customer_name  = Column(String, default="")
    policy_number  = Column(String, default="")
    description    = Column(String, default="")
    status         = Column(String, default="pending")
    amount         = Column(Float, default=0.0)
    notes          = Column(String, default="Claim received, awaiting initial review")
    submitted_at   = Column(DateTime, default=datetime.utcnow)
    updated_at     = Column(DateTime, default=datetime.utcnow)

class DummyFile(Base):
    __tablename__ = "dummy_files"
    id           = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name         = Column(String, nullable=False)
    filename     = Column(String, nullable=False)
    content_type = Column(String, nullable=False)
    data         = Column(String, nullable=False)   # base64-encoded file bytes
    created_at   = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# ── Seed data ─────────────────────────────────────────────────────────────────

SEED_CUSTOMERS = [
    ("c1",  "Amina Wanjiku Mwangi",    "A123456789B", "28341027", "0712 345 678", "amina.mwangi@gmail.com",     "Westlands, Nairobi",         "active"),
    ("c2",  "Brian Otieno Odhiambo",   "B234567890C", "31456789", "0723 456 789", "b.otieno@outlook.com",        "Kilimani, Nairobi",          "active"),
    ("c3",  "Catherine Njeri Kamau",   "C345678901D", "22987654", "0734 567 890", "cnjeri@gmail.com",            "Karen, Nairobi",             "active"),
    ("c4",  "David Kipchoge Rotich",   "D456789012E", "29876543", "0745 678 901", "d.rotich@safaricom.co.ke",    "Eldoret, Uasin Gishu",       "active"),
    ("c5",  "Eunice Akinyi Omondi",    "E567890123F", "33214567", "0756 789 012", "eunice.omondi@yahoo.com",     "Kisumu, Kisumu County",      "inactive"),
    ("c6",  "Francis Mwenda Mutua",    "F678901234G", "26543210", "0767 890 123", "fmutua@gmail.com",            "Machakos, Machakos County",  "active"),
    ("c7",  "Grace Chebet Kipkoech",   "G789012345H", "30987654", "0778 901 234", "grace.chebet@gmail.com",      "Nakuru, Nakuru County",      "inactive"),
    ("c8",  "Hassan Abdi Mohamed",     "H890123456I", "27654321", "0789 012 345", "hassan.abdi@gmail.com",       "Mombasa, Mombasa County",    "active"),
    ("c9",  "Irene Wambui Gichuru",    "I901234567J", "32109876", "0790 123 456", "irene.wambui@outlook.com",    "Thika, Kiambu County",       "active"),
    ("c10", "James Ndirangu Kamau",    "J012345678K", "25432198", "0701 234 567", "j.ndirangu@gmail.com",        "Nyeri, Nyeri County",        "active"),
    ("c11", "Kezia Moraa Nyamweya",    "K123456789L", "34567890", "0712 345 901", "kezia.moraa@gmail.com",       "Kisii, Kisii County",        "active"),
    ("c12", "Lilian Auma Were",        "L234567890M", "28901234", "0723 456 012", "l.auma@yahoo.com",            "Busia, Busia County",        "inactive"),
    ("c13", "Martin Kariuki Mwangi",   "M345678901N", "31234567", "0734 567 123", "martin.kariuki@gmail.com",    "Ruiru, Kiambu County",       "active"),
    ("c14", "Nancy Wanjiru Njoroge",   "N456789012O", "27890123", "0745 678 234", "nancy.njoroge@gmail.com",     "Kikuyu, Kiambu County",      "active"),
    ("c15", "Oscar Ochieng Otieno",    "O567890123P", "30123456", "0756 789 345", "o.ochieng@gmail.com",         "Homa Bay, Homa Bay County",  "active"),
    ("c16", "Phyllis Cherotich Sang",  "P678901234Q", "26789012", "0767 890 456", "phyllis.sang@outlook.com",    "Kericho, Kericho County",    "active"),
    ("c17", "Quincy Juma Barasa",      "Q789012345R", "33456789", "0778 901 567", "qjuma@gmail.com",             "Kakamega, Kakamega County",  "inactive"),
    ("c18", "Ruth Nyambura Githinji",  "R890123456S", "29012345", "0789 012 678", "ruth.nyambura@gmail.com",     "Limuru, Kiambu County",      "active"),
    ("c19", "Samuel Waweru Mungai",    "S901234567T", "32345678", "0790 123 789", "s.waweru@gmail.com",          "Githunguri, Kiambu County",  "active"),
    ("c20", "Teresa Adhiambo Oloo",    "T012345678U", "25678901", "0701 234 890", "teresa.oloo@gmail.com",       "Siaya, Siaya County",        "active"),
    ("c21", "Usman Farah Abdi",        "U123456789V", "34012345", "0712 345 901", "usman.farah@gmail.com",       "Garissa, Garissa County",    "active"),
    ("c22", "Veronica Wangari Mugo",   "V234567890W", "28456789", "0723 456 012", "v.wangari@outlook.com",       "Murang'a, Murang'a County",  "active"),
    ("c23", "Walter Maina Kimani",     "W345678901X", "31789012", "0734 567 123", "walter.maina@gmail.com",      "Juja, Kiambu County",        "active"),
    ("c24", "Xenia Awino Anyango",     "X456789012Y", "27234567", "0745 678 234", "xenia.anyango@gmail.com",     "Migori, Migori County",      "inactive"),
    ("c25", "Zachary Kipngetich Bett", "Z567890123A", "30567890", "0756 789 345", "z.bett@gmail.com",            "Bomet, Bomet County",        "active"),
]

SEED_POLICIES = [
    ("p1",  "WYO-MOT-2024-000101", "c1",  "Amina Wanjiku Mwangi",    "motor",   "2024-01-15", "2025-01-15", 28500,  "active"),
    ("p2",  "WYO-MOT-2024-000102", "c1",  "Amina Wanjiku Mwangi",    "medical", "2024-03-01", "2025-03-01", 45000,  "active"),
    ("p3",  "WYO-MOT-2024-000103", "c2",  "Brian Otieno Odhiambo",   "motor",   "2024-02-10", "2024-11-15", 32000,  "expired"),
    ("p4",  "WYO-MOT-2024-000104", "c3",  "Catherine Njeri Kamau",   "motor",   "2024-04-01", "2025-04-01", 25000,  "active"),
    ("p5",  "WYO-MOT-2024-000105", "c3",  "Catherine Njeri Kamau",   "medical", "2024-06-15", "2025-06-15", 60000,  "active"),
    ("p6",  "WYO-MOT-2024-000106", "c3",  "Catherine Njeri Kamau",   "fire",    "2024-01-01", "2024-12-31", 18000,  "active"),
    ("p7",  "WYO-MOT-2024-000107", "c4",  "David Kipchoge Rotich",   "motor",   "2024-05-20", "2025-05-20", 35000,  "active"),
    ("p8",  "WYO-MOT-2024-000108", "c4",  "David Kipchoge Rotich",   "fire",    "2023-11-01", "2024-11-01", 22000,  "expired"),
    ("p9",  "WYO-MOT-2024-000109", "c5",  "Eunice Akinyi Omondi",    "medical", "2024-07-01", "2025-07-01", 52000,  "pending"),
    ("p10", "WYO-MOT-2024-000110", "c6",  "Francis Mwenda Mutua",    "motor",   "2024-03-15", "2025-03-15", 29000,  "active"),
    ("p11", "WYO-MOT-2024-000111", "c6",  "Francis Mwenda Mutua",    "fire",    "2024-08-01", "2025-08-01", 15000,  "active"),
    ("p12", "WYO-MOT-2024-000112", "c8",  "Hassan Abdi Mohamed",     "motor",   "2024-02-28", "2025-02-28", 41000,  "active"),
    ("p13", "WYO-MOT-2024-000113", "c8",  "Hassan Abdi Mohamed",     "medical", "2024-09-01", "2025-09-01", 75000,  "active"),
    ("p14", "WYO-MOT-2024-000114", "c9",  "Irene Wambui Gichuru",    "motor",   "2024-10-15", "2025-11-05", 27000,  "active"),
    ("p15", "WYO-MOT-2024-000115", "c9",  "Irene Wambui Gichuru",    "fire",    "2024-04-01", "2025-04-01", 19500,  "active"),
    ("p16", "WYO-MOT-2024-000116", "c13", "Martin Kariuki Mwangi",   "motor",   "2024-01-20", "2025-01-20", 33000,  "active"),
    ("p17", "WYO-MOT-2024-000117", "c13", "Martin Kariuki Mwangi",   "medical", "2024-05-01", "2025-05-01", 48000,  "active"),
    ("p18", "WYO-MOT-2024-000118", "c16", "Phyllis Cherotich Sang",  "motor",   "2024-07-10", "2025-07-10", 26500,  "active"),
    ("p19", "WYO-MOT-2024-000119", "c19", "Samuel Waweru Mungai",    "motor",   "2024-11-10", "2025-11-10", 38000,  "active"),
    ("p20", "WYO-MOT-2024-000120", "c21", "Usman Farah Abdi",        "fire",    "2024-06-01", "2024-11-20", 17000,  "active"),
]

SEED_CLAIMS = [
    ("cl1",  "CLM-2024-0000001", "c1",  "Amina Wanjiku Mwangi",    "WYO-MOT-2024-000101", "Rear-end collision on Thika Road",          "paid",         85000,  "Payment disbursed to claimant",                "2024-10-01"),
    ("cl2",  "CLM-2024-0000002", "c2",  "Brian Otieno Odhiambo",   "WYO-MOT-2024-000103", "Vehicle theft at Westgate Mall",            "approved",    120000,  "Claim approved, processing payment",           "2024-10-05"),
    ("cl3",  "CLM-2024-0000003", "c3",  "Catherine Njeri Kamau",   "WYO-MOT-2024-000105", "Hospitalisation — appendectomy",            "under_review", 45000,  "Awaiting surveyor report",                     "2024-10-08"),
    ("cl4",  "CLM-2024-0000004", "c4",  "David Kipchoge Rotich",   "WYO-MOT-2024-000107", "Windscreen & panel damage — hailstorm",     "pending",     200000,  "Claim received, awaiting initial review",      "2024-10-10"),
    ("cl5",  "CLM-2024-0000005", "c6",  "Francis Mwenda Mutua",    "WYO-MOT-2024-000111", "Warehouse fire — electrical fault",         "rejected",    350000,  "Insufficient documentation provided",          "2024-10-12"),
    ("cl6",  "CLM-2024-0000006", "c8",  "Hassan Abdi Mohamed",     "WYO-MOT-2024-000112", "Accident on Mombasa-Nairobi highway",       "under_review", 95000,  "Awaiting surveyor report",                     "2024-10-15"),
    ("cl7",  "CLM-2024-0000007", "c9",  "Irene Wambui Gichuru",    "WYO-MOT-2024-000114", "Flood damage — parking basement",           "approved",     65000,  "Claim approved, processing payment",           "2024-10-18"),
    ("cl8",  "CLM-2024-0000008", "c13", "Martin Kariuki Mwangi",   "WYO-MOT-2024-000116", "Hit and run — Northern Bypass",             "pending",     180000,  "Claim received, awaiting initial review",      "2024-10-20"),
    ("cl9",  "CLM-2024-0000009", "c14", "Nancy Wanjiru Njoroge",   "WYO-MOT-2024-000101", "Minor fender bender — Ngong Road",          "paid",         30000,  "Payment disbursed to claimant",                "2024-10-22"),
    ("cl10", "CLM-2024-0000010", "c16", "Phyllis Cherotich Sang",  "WYO-MOT-2024-000118", "Engine damage — flooding Nakuru",           "under_review", 75000,  "Awaiting surveyor report",                     "2024-10-24"),
    ("cl11", "CLM-2024-0000011", "c18", "Ruth Nyambura Githinji",  "WYO-MOT-2024-000102", "Surgery — knee replacement",                "approved",    120000,  "Claim approved, processing payment",           "2024-10-25"),
    ("cl12", "CLM-2024-0000012", "c19", "Samuel Waweru Mungai",    "WYO-MOT-2024-000119", "Carjacking — Kahawa Wendani",               "pending",     250000,  "Claim received, awaiting initial review",      "2024-10-27"),
    ("cl13", "CLM-2024-0000013", "c21", "Usman Farah Abdi",        "WYO-MOT-2024-000120", "Shop fire — Garissa Town Centre",           "under_review",400000,  "Awaiting surveyor report",                     "2024-10-28"),
    ("cl14", "CLM-2024-0000014", "c3",  "Catherine Njeri Kamau",   "WYO-MOT-2024-000104", "Side-swipe — Ngong Road roundabout",        "pending",      55000,  "Claim received, awaiting initial review",      "2024-10-29"),
    ("cl15", "CLM-2024-0000015", "c8",  "Hassan Abdi Mohamed",     "WYO-MOT-2024-000113", "ICU admission — cardiac event",             "approved",     88000,  "Claim approved, processing payment",           "2024-10-30"),
    ("cl16", "CLM-2024-0000016", "c13", "Martin Kariuki Mwangi",   "WYO-MOT-2024-000117", "Outpatient — diagnostic tests",             "paid",         42000,  "Payment disbursed to claimant",                "2024-10-31"),
    ("cl17", "CLM-2024-0000017", "c25", "Zachary Kipngetich Bett", "WYO-MOT-2024-000110", "Total loss — drunk driver collision",        "pending",     160000,  "Claim received, awaiting initial review",      "2024-11-01"),
    ("cl18", "CLM-2024-0000018", "c23", "Walter Maina Kimani",     "WYO-MOT-2024-000112", "Burst tyre — rollover Kiambu Road",         "under_review", 70000,  "Awaiting surveyor report",                     "2024-11-01"),
    ("cl19", "CLM-2024-0000019", "c11", "Kezia Moraa Nyamweya",    "WYO-MOT-2024-000105", "Maternity — private hospital",              "pending",      95000,  "Claim received, awaiting initial review",      "2024-11-01"),
    ("cl20", "CLM-2024-0000020", "c6",  "Francis Mwenda Mutua",    "WYO-MOT-2024-000110", "Alleged theft — insufficient evidence",     "rejected",    310000,  "Insufficient documentation provided",          "2024-11-01"),
]


def seed_db():
    db = SessionLocal()
    try:
        if db.query(Customer).count() > 0:
            return  # already seeded
        for row in SEED_CUSTOMERS:
            db.add(Customer(id=row[0], name=row[1], kra_pin=row[2], id_number=row[3],
                            phone=row[4], email=row[5], address=row[6], status=row[7]))
        for row in SEED_POLICIES:
            db.add(Policy(id=row[0], policy_number=row[1], customer_id=row[2],
                          customer_name=row[3], cover_type=row[4], start_date=row[5],
                          expiry_date=row[6], premium=row[7], status=row[8]))
        for row in SEED_CLAIMS:
            submitted = datetime.strptime(row[9], "%Y-%m-%d")
            db.add(Claim(id=row[0], claim_id=row[1], customer_id=row[2],
                         customer_name=row[3], policy_number=row[4], description=row[5],
                         status=row[6], amount=row[7], notes=row[8],
                         submitted_at=submitted, updated_at=submitted))
        db.commit()
    finally:
        db.close()


# ── App & auth ────────────────────────────────────────────────────────────────

app = FastAPI(title="Wayyo Insurance API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

VALID_API_KEY = "ins_live_key_demo_2024"

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def auth(x_api_key: str = Header(...)):
    if x_api_key != VALID_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")

def save_upload(file: UploadFile) -> str:
    ext = os.path.splitext(file.filename or "file")[1] or ".bin"
    dest = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}{ext}")
    with open(dest, "wb") as f:
        shutil.copyfileobj(file.file, f)
    return os.path.basename(dest)


@app.on_event("startup")
def startup():
    seed_db()


# ── Pydantic schemas ──────────────────────────────────────────────────────────

class CustomerCreate(BaseModel):
    name: str
    kra_pin: str
    id_number: str
    phone: str = ""
    email: str = ""
    address: str = ""

class ClaimStatusUpdate(BaseModel):
    status: str
    notes: str = ""


# ── Customer endpoints ────────────────────────────────────────────────────────

@app.get("/api/customers")
def list_customers(db: Session = Depends(get_db), _=Depends(auth)):
    customers = db.query(Customer).order_by(Customer.created_at.desc()).all()
    result = []
    for c in customers:
        policies_count = db.query(Policy).filter(Policy.customer_id == c.id).count()
        last_claim = (db.query(Claim)
                      .filter(Claim.customer_id == c.id)
                      .order_by(Claim.submitted_at.desc())
                      .first())
        last_activity = (last_claim.submitted_at.strftime("%Y-%m-%d")
                         if last_claim else c.created_at.strftime("%Y-%m-%d"))
        result.append({
            "id": c.id,
            "name": c.name,
            "kra_pin": c.kra_pin,
            "id_number": c.id_number,
            "phone": c.phone,
            "email": c.email,
            "address": c.address,
            "status": c.status,
            "policiesCount": policies_count,
            "lastActivity": last_activity,
        })
    return result

@app.get("/api/customers/{customer_id}")
def get_customer(customer_id: str, db: Session = Depends(get_db), _=Depends(auth)):
    c = db.query(Customer).filter(Customer.id == customer_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Customer not found")
    policies = db.query(Policy).filter(Policy.customer_id == customer_id).all()
    claims   = db.query(Claim).filter(Claim.customer_id == customer_id).order_by(Claim.submitted_at.desc()).all()
    return {
        "id": c.id, "name": c.name, "kra_pin": c.kra_pin, "id_number": c.id_number,
        "phone": c.phone, "email": c.email, "address": c.address, "status": c.status,
        "created_at": c.created_at.isoformat(),
        "policies": [_policy_dict(p) for p in policies],
        "claims":   [_claim_dict(cl) for cl in claims],
    }

@app.post("/api/customers", status_code=201)
def create_customer(payload: CustomerCreate, db: Session = Depends(get_db), _=Depends(auth)):
    existing = db.query(Customer).filter(Customer.kra_pin == payload.kra_pin).first()
    if existing:
        raise HTTPException(status_code=409, detail="Customer with this KRA PIN already exists")
    c = Customer(**payload.model_dump())
    db.add(c)
    db.commit()
    db.refresh(c)
    return {"id": c.id, "name": c.name, "kra_pin": c.kra_pin}


# ── Policy endpoints ──────────────────────────────────────────────────────────

def _policy_dict(p: Policy) -> dict:
    return {
        "id": p.id, "policyNumber": p.policy_number, "customerId": p.customer_id,
        "customerName": p.customer_name, "coverType": p.cover_type,
        "startDate": p.start_date, "expiryDate": p.expiry_date,
        "premium": p.premium, "status": p.status,
        "createdAt": p.created_at.isoformat(),
    }

@app.get("/api/policies")
def list_policies(db: Session = Depends(get_db), _=Depends(auth)):
    policies = db.query(Policy).order_by(Policy.created_at.desc()).all()
    return [_policy_dict(p) for p in policies]

@app.get("/api/policies/{policy_number}")
def get_policy(policy_number: str, db: Session = Depends(get_db), _=Depends(auth)):
    p = db.query(Policy).filter(Policy.policy_number == policy_number).first()
    if not p:
        raise HTTPException(status_code=404, detail="Policy not found")
    return _policy_dict(p)

class CreateCoverPayload(BaseModel):
    customer_name: str
    policy_number: str
    cover_type:    str   = "motor"
    premium:       float = 5000.0

@app.post("/api/covers/create")
async def create_cover(
    payload: CreateCoverPayload,
    db: Session = Depends(get_db),
    _=Depends(auth),
):
    created = datetime.utcnow()
    expiry  = created + timedelta(days=365)

    policy = Policy(
        policy_number=payload.policy_number,
        customer_id=None,
        customer_name=payload.customer_name,
        cover_type=payload.cover_type,
        start_date=created.strftime("%Y-%m-%d"),
        expiry_date=expiry.strftime("%Y-%m-%d"),
        premium=payload.premium,
        status="active",
    )
    db.add(policy)
    db.commit()

    return {
        "policy_number": payload.policy_number,
        "cover_type":    payload.cover_type,
        "premium":       payload.premium,
        "created_at":    created.isoformat() + "Z",
        "expiry_date":   expiry.strftime("%Y-%m-%d"),
        "customer_name": payload.customer_name,
    }


# ── Claim endpoints ───────────────────────────────────────────────────────────

def _claim_dict(c: Claim) -> dict:
    return {
        "id": c.id, "claimId": c.claim_id, "customerId": c.customer_id,
        "customerName": c.customer_name, "policyNumber": c.policy_number,
        "description": c.description, "status": c.status, "amount": c.amount,
        "notes": c.notes,
        "dateSubmitted": c.submitted_at.strftime("%Y-%m-%d"),
        "submittedAt": c.submitted_at.isoformat(),
        "updatedAt": c.updated_at.isoformat(),
    }

@app.get("/api/claims")
def list_claims(db: Session = Depends(get_db), _=Depends(auth)):
    claims = db.query(Claim).order_by(Claim.submitted_at.desc()).all()
    return [_claim_dict(c) for c in claims]

@app.get("/api/claims/status")
def get_claim_status(claim_id: str = Query(...), db: Session = Depends(get_db), _=Depends(auth)):
    claim = db.query(Claim).filter(Claim.claim_id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    return {
        "claim_id":   claim.claim_id,
        "status":     claim.status,
        "updated_at": claim.updated_at.isoformat() + "Z",
        "notes":      claim.notes,
    }

@app.get("/api/claims/{claim_id}")
def get_claim(claim_id: str, db: Session = Depends(get_db), _=Depends(auth)):
    claim = db.query(Claim).filter(Claim.claim_id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    return _claim_dict(claim)

@app.patch("/api/claims/{claim_id}/status")
def update_claim_status(
    claim_id: str,
    payload: ClaimStatusUpdate,
    db: Session = Depends(get_db),
    _=Depends(auth),
):
    claim = db.query(Claim).filter(Claim.claim_id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    notes_map = {
        "pending":      "Claim received, awaiting initial review",
        "under_review": "Awaiting surveyor report",
        "approved":     "Claim approved, processing payment",
        "rejected":     "Insufficient documentation provided",
        "paid":         "Payment disbursed to claimant",
    }
    claim.status     = payload.status
    claim.notes      = payload.notes or notes_map.get(payload.status, "")
    claim.updated_at = datetime.utcnow()
    db.commit()
    return _claim_dict(claim)

class SubmitClaimPayload(BaseModel):
    customer_name: str
    description:   str   = ""
    amount:        float = 0

@app.post("/api/claims/submit")
async def submit_claim(
    payload: SubmitClaimPayload,
    db: Session = Depends(get_db),
    _=Depends(auth),
):
    seq = db.query(Claim).count() + 1
    now = datetime.utcnow()
    claim_id = f"CLM-{now.year}-{seq:07d}"
    policy_number = f"WYO-MOT-{now.year}-{seq:06d}"

    claim = Claim(
        claim_id=claim_id,
        customer_id=None,
        customer_name=payload.customer_name,
        policy_number=policy_number,
        description=payload.description,
        amount=payload.amount,
        status="pending",
        notes="Claim received, awaiting initial review",
        submitted_at=now,
        updated_at=now,
    )
    db.add(claim)
    db.commit()

    return {
        "claim_id":      claim_id,
        "policy_number": policy_number,
        "submitted_at":  now.isoformat() + "Z",
        "status":        "pending",
    }


# ── Stats endpoint ────────────────────────────────────────────────────────────

@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db), _=Depends(auth)):
    active_policies  = db.query(Policy).filter(Policy.status == "active").count()
    open_claims      = db.query(Claim).filter(Claim.status.in_(["pending", "under_review"])).count()
    resolved_claims  = db.query(Claim).filter(Claim.status.in_(["approved", "paid"])).count()
    total_revenue    = db.query(Policy).with_entities(Policy.premium).all()
    revenue_sum      = sum(r[0] for r in total_revenue if r[0])
    total_customers  = db.query(Customer).filter(Customer.status == "active").count()
    return {
        "active_policies":  active_policies,
        "open_claims":      open_claims,
        "resolved_claims":  resolved_claims,
        "total_revenue":    revenue_sum,
        "total_customers":  total_customers,
    }


# ── DUMMY-FILE endpoints ──────────────────────────────────────────────────────

class DummyFileUploadResponse(BaseModel):
    """Returned after a successful file upload."""
    id:           str
    name:         str
    filename:     str
    content_type: str
    created_at:   str

class DummyFileDetailResponse(BaseModel):
    """Full record including the base64 data URI ready for use in an <img> tag."""
    id:           str
    name:         str
    filename:     str
    content_type: str
    data_uri:     str   # e.g. "data:image/jpeg;base64,/9j/4AAQ..."
    created_at:   str


def _dummy_file_summary(f: DummyFile) -> dict:
    return {
        "id":           f.id,
        "name":         f.name,
        "filename":     f.filename,
        "content_type": f.content_type,
        "created_at":   f.created_at.isoformat(),
    }


@app.post(
    "/api/dummy-file/upload",
    response_model=DummyFileUploadResponse,
    tags=["DUMMY-FILE"],
    summary="Upload a file (stored as Base64)",
    description="""
Upload a file via multipart/form-data. The file bytes are Base64-encoded and
stored in the database. No disk storage is used after encoding.

**Example curl:**
```bash
curl -X POST http://localhost:8000/api/dummy-file/upload \\
  -H "x-api-key: ins_live_key_demo_2024" \\
  -F "name=John" \\
  -F "avatar=@/path/to/photo.jpg"
```
""",
)
async def upload_dummy_file(
    name:   str        = Form(..., description="Display name associated with the file"),
    avatar: UploadFile = File(..., description="The file to upload (image, PDF, etc.)"),
    db:     Session    = Depends(get_db),
    _=Depends(auth),
):
    raw          = await avatar.read()
    b64          = base64.b64encode(raw).decode("utf-8")
    content_type = avatar.content_type or "application/octet-stream"
    filename     = avatar.filename or "file"

    record = DummyFile(
        name=name,
        filename=filename,
        content_type=content_type,
        data=b64,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return _dummy_file_summary(record)


@app.get(
    "/api/dummy-file",
    tags=["DUMMY-FILE"],
    summary="List all uploaded files (metadata only)",
    description="Returns metadata for every uploaded file. The `data_uri` field is **not** included here to keep the list lightweight — fetch `/api/dummy-file/{id}` for the full record.",
)
def list_dummy_files(db: Session = Depends(get_db), _=Depends(auth)):
    files = db.query(DummyFile).order_by(DummyFile.created_at.desc()).all()
    return [_dummy_file_summary(f) for f in files]


@app.get(
    "/api/dummy-file/{file_id}",
    response_model=DummyFileDetailResponse,
    tags=["DUMMY-FILE"],
    summary="Retrieve a file with its Base64 data URI",
    description="""
Returns the full record including a `data_uri` string formatted as:

```
data:<content_type>;base64,<encoded_bytes>
```

You can use this directly in an HTML `<img>` tag or as the `src` of any media element:

```html
<img src="{{ data_uri }}" />
```
""",
)
def get_dummy_file(file_id: str, db: Session = Depends(get_db), _=Depends(auth)):
    f = db.query(DummyFile).filter(DummyFile.id == file_id).first()
    if not f:
        raise HTTPException(status_code=404, detail="File not found")
    return {
        **_dummy_file_summary(f),
        "data_uri": f"data:{f.content_type};base64,{f.data}",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
