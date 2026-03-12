# Start2impact-progetto-finale
requisiti "tecnici"
- test 
- messaggi di feedback: (tramite toast)
        - messaggio di benvenuto quando si logga
        - messaggio di creazione corretta della scheda/allenamento 
        - cliente creato con successo 
        - errori vari

palestra : JS Gym 

--> SEEDING: controlla come inserire dei dati di "test" nel db 

FRONTEND APPUNTI

- puoi usare errorElement nel router per gli errori di render (se sollevo una eccezione che però non mi porta a renderizzare la pagina, allora non comparirà la pagina di errore)
- fai una pagina bella per il 404
- fai la loading page
- volendo la pagina di errore puoi metterla dentro al main layout così se c'è 404 non scompare il menu e l'header
- aggiungi paginazione nella api e nella tabella clienti
 


--> per la tabella usa un operatore ternario sul numero di clienti per mostrare la tabella oppure un component di error

appunti 
lo store dovrebbe anche salvare lo userId?
per poi usare quello per capire se l'utente è loggato o meno visto che c'è il logout
potrebbe anche controllare che esista nel db 



3. gestione is loading -> crea un component e vedi se conviene metterlo in redux (così fai comparire una rotellina al posto di tutta la pagina, vedi se semplifica il codice)
4. messaggi di feedback tramite toast 