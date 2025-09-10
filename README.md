 

Kurulum

Bağımlılıklar:

Node.js 
Python 3.10  
Docker  


Frontend:
cd frontend
npm install
npm run dev


Backend:
cd backend
pip install -r requirements.txt
uvicorn main:app --reload


Docker:
docker-compose up -d


AWS S3:

AWS hesabında bucket oluştur  
AWS_ACCESS_KEY_ID ve AWS_SECRET_ACCESS_KEY environment değişkenlerini ayarla.



Çalıştırma

Frontend: http://localhost:5173
Backend: http://localhost:8000
Elasticsearch: http://localhost:9200
RabbitMQ: http://localhost:15672

Ölçeklendirme

AWS ECS/EKS ile backend ölçeklendirme
AWS RDS PostgreSQL (read replicas, Citus sharding)
Redis ElastiCache (caching)
AWS ALB (yük dengeleme)

Lisans
MIT
