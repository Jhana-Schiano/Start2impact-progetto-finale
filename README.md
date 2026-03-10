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
- aggiungi paginazione nella api e nella tabella clienti

useParams (di react router) per prendere i parametri dalla route, useSearchParams per i query params
usenavigate per navigare tra le pagine. nel menu usi il link, ma se hai delle azioni (tipo bottoni) usi il navigate 
puoi anche passare lo state, ma è uno stato non persistito (se ricarichi perdi tutto quindi non si usa tanto) 


MODALE 
ok usare bool open e onclose function passati dall'esterno 
usi il bool open per mostrare il componente 
per la tabella usa un operatore ternario sul numero di clienti per mostrare la tabella oppure un component di error

fai degli hook per le chiamate api. fa il fetch get e espone il risultato in una variabile. puoi anche esporre il metodo get così sullo useEffect chiami il metodo dell'hook che popolerà la variabile che poi potrai usare (usa useCallback nella get sennò va in loop)
altrimenti possiamo fare che l'hook quando viene tirato dentro in un componente fa in automatico la get (sposti lo use effect dentro l'hook al posto del componente).
spesso si fa useeffect in pagina così hai più controllo 
gli hook hanno anche lo use state per salvare lo stato
puoi fare hook anche per le post/put
