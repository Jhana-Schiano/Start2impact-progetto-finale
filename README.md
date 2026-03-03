# Start2impact-progetto-finale

BACKEND APPUNTI

dominio 
cliente (nome, cognome, codice fiscale, telefono, email, altezza, peso, sesso, data nascita, note aggiuntive, ... )
utente/pt (nome, cognome, email, telefono, data di nascita, indirizzo, )
scheda (inizio, fine, obiettivo)
allenamento (aree allenate, durata, giorno)
esercizio (volume in kg, nome, attrezzo e la posizione rispetto all'allenamento)
serie (rip, ced, riposo in sec)

features:
crea scheda con dentro uno o più allenamenti, un cliente 
crea allenamento con almeno un es
aggiungi serie 
aggiungi es 
modifica es, serie o allenamento 
crea e modifica cliente
modifica il proprio profilo utente 
login / logout 
registrazione utente


requisiti "tecnici"
- test 
- messaggi di feedback:
        - messaggio di benvenuto quando si logga
        - messaggio di creazione corretta della scheda/allenamento 
        - cliente creato con successo 
        - errori vari

palestra : JS Gym 

--> SEEDING: controlla come inserire dei dati di "test" nel db -->



FRONTEND APPUNTI
header e layout dovrebbero avere lo stesso colore/profondità? (header sembra troppo visibile)


- puoi usare errorElement nel router per gli errori di render (se sollevo una eccezione che però non mi porta a renderizzare la pagina, allora non comparirà la pagina di errore)
- fai una pagina bella per il 404
- fai la loading page
- volendo la pagina di errore puoi metterla dentro al main layout così se c'è 404 non scompare il menu e l'header

useParams (di react router) per prendere i parametri dalla route, useSearchParams per i query params
usenavigate per navigare tra le pagine. nel menu usi il link, ma se hai delle azioni (tipo bottoni) usi il navigate 
puoi anche passare lo state, ma è uno stato non persistito (se ricarichi perdi tutto quindi non si usa tanto) 