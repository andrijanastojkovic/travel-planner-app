# TravelPlannerApp

Aplikacija za planiranje putovanja. Korisnik može kreirati planove putovanja, dodavati destinacije, aktivnosti po danima (sa prikazom kroz listu grupisanu po datumu i kroz kalendar), checklist stavke i troškove, kao i deliti plan sa drugim osobama preko linka.

Backend je razvijen kao Microsoft Service Fabric mikroservisna aplikacija (.NET 8 / ASP.NET Core), frontend kao React (Vite) aplikacija.

## Arhitektura

Sistem se sastoji od tri mikroservisa, svaki sa sopstvenom SQL Server bazom:

| Servis | Tip | Odgovornost | Baza | Port |
|---|---|---|---|---|
| UserService | Stateful | Registracija, prijava, JWT autentikacija | UserServiceDb | 5011 |
| TripPlanningService | Stateful | Planovi putovanja, destinacije, aktivnosti, checklist, deljenje | TripPlanningDb | 5012 |
| ExpenseService | Stateless | Troškovi i obračun potrošenog budžeta | ExpenseDb | 8845 |

Frontend komunicira direktno sa svakim servisom preko REST API-ja, koristeći JWT token dobijen prilikom prijave. Autorizacija sa deljenim planovima je javno dostupna preko posebnog tokena, bez potrebe za nalogom.

## Preduslovi

- .NET 8 SDK
- Node.js 20+ i npm
- SQL Server 2025 Express (ili noviji), instanca dostupna na localhost\SQLEXPRESS01 (ili prilagoditi connection string)
- Visual Studio 2022 sa Service Fabric SDK-om (verzija 7.1.2175) i Service Fabric Runtime-om (verzija 10.1.2448.9590) i Azure development workload-om

## Podešavanje baze

Connection string-ovi u appsettings.json svakog servisa koriste:

Server=localhost\SQLEXPRESS01;Trusted_Connection=True;TrustServerCertificate=True;

Ako je naziv instance na vašem računaru drugačiji, potrebno je izmeniti ConnectionStrings sekciju u appsettings.json fajlu svakog servisa (UserService, TripPlanningService, ExpenseService).

Baze i tabele se kreiraju automatski primenom EF Core migracija:

cd UserService
dotnet ef database update

cd ../TripPlanningService
dotnet ef database update

cd ../ExpenseService
dotnet ef database update

Važna napomena: kada se servisi pokreću kroz Service Fabric, izvršavaju se pod Windows nalogom NT AUTHORITY\NETWORK SERVICE. Potrebno je dodeliti ovom nalogu pristup bazama pre prvog pokretanja:

USE master;
CREATE LOGIN [NT AUTHORITY\NETWORK SERVICE] FROM WINDOWS;

USE UserServiceDb;
CREATE USER [NT AUTHORITY\NETWORK SERVICE] FOR LOGIN [NT AUTHORITY\NETWORK SERVICE];
ALTER ROLE db_owner ADD MEMBER [NT AUTHORITY\NETWORK SERVICE];

USE TripPlanningDb;
CREATE USER [NT AUTHORITY\NETWORK SERVICE] FOR LOGIN [NT AUTHORITY\NETWORK SERVICE];
ALTER ROLE db_owner ADD MEMBER [NT AUTHORITY\NETWORK SERVICE];

USE ExpenseDb;
CREATE USER [NT AUTHORITY\NETWORK SERVICE] FOR LOGIN [NT AUTHORITY\NETWORK SERVICE];
ALTER ROLE db_owner ADD MEMBER [NT AUTHORITY\NETWORK SERVICE];

## Pokretanje backend-a (Service Fabric)

1. Pokrenite Service Fabric Local Cluster Manager iz System Tray → Start Local Cluster (prvo pokretanje nakon instalacije zahteva Setup Local Cluster → Windows 1 Node)
2. Otvorite TravelPlannerApp.sln u Visual Studio 2022 pokrenutom kao administrator
3. Postavite TravelPlannerApp kao Startup Project
4. Pritisnite F5

Nakon uspešnog deployment-a (poruka "The application is ready" u Output prozoru), servisi su dostupni na:
- UserService: http://localhost:5011/swagger
- TripPlanningService: http://localhost:5012/swagger
- ExpenseService: http://localhost:8845/swagger

### Alternativa — standalone pokretanje

Svaki servis takođe podržava pokretanje kao obična ASP.NET Core aplikacija, bez Service Fabric klastera — korisno za brzo testiranje pojedinačnog servisa:

cd UserService
dotnet run -- --standalone

(isto za TripPlanningService i ExpenseService). U ovom modu portovi se dinamički dodeljuju i ispisuju u terminalu.

## Pokretanje frontend-a

cd TravelPlannerFrontend
npm install
npm run dev

Aplikacija je dostupna na http://localhost:5173.

Frontend koristi .env fajl sa URL-ovima backend servisa:

VITE_USER_SERVICE_URL=http://localhost:5011
VITE_TRIP_SERVICE_URL=http://localhost:5012
VITE_EXPENSE_SERVICE_URL=http://localhost:8845

## Struktura projekta

```
TravelPlannerApp/
├── UserService/            # Autentikacija (stateful)
├── TripPlanningService/    # Planovi, destinacije,         aktivnosti, checklist, deljenje (stateful)
├── ExpenseService/         # Troškovi (stateless)
├── TravelPlannerApp/       # Service Fabric application projekat
└── TravelPlannerFrontend/  # React frontend
    └── src/
        ├── components/     # React komponente po funkcionalnim celinama
        ├── context/        # Auth Context (stanje ulogovanog korisnika)
        ├── models/         # Modeli podataka na frontendu
        ├── pages/          # Stranice aplikacije
        └── services/       # HTTP komunikacija sa backend servisima
```

## Autor

Andrijana Stojković