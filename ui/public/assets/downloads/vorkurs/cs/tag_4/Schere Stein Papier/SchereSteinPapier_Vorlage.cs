/*------------------- "Schere", "Stein", "Papier" ------------------- 
In dieser Aufgabe erstellen wir das Spiel "Schere, Stein, Papier" in C#!
Im folgenden Code ist schon eine grobe Struktur vorgegeben, der man folgen kann.
Gerne könnt ihr das Spiel auch erweitern (z.B. rundenbasiert, 3 Leben, mehr Auswahlmöglichkeiten, etc.).
Ziel ist es, alle Bereiche zu erstellen/bearbeiten und am Ende ein funktionierendes Spiel zu haben!
*/


//-------- 1. Optionen festlegen -------- 
/* 
start des Spiels, Auswahlmöglichkeiten werden festgelegt

schreibe eine kleine Willkommens-Nachricht in "willkommensNachricht"
*/

string[] optionen = { "Schere", "Stein", "Papier" };
string willkommensNachricht = ;
Console.WriteLine(willkommensNachricht);



//-------- 2. Spieler-Eingabe lesen -------- 
/* 
Spieler trifft seine Wahl, 
dazu soll Console.ReadLine() verwendet werden, um eine Eingabe im Terminal einzulesen

vervollständige "spielerWahl"
*/
string spielerWahl = ;



//-------- 3. Zufalls-Eingabe für Computer generieren -------- 
/* 
hier wählt Computer eine zufällige Wahl aus den Auswahlmöglichkeiten.
Wir benutzen dazu "Random", um eine Zufallszahl zu generieren.
zufallsZahl ist eine zufällige Zahl von 0 bis 2

vervollständige "computerWahl"
gib die Wahl des Computers mit einer Nachricht aus
*/
Random randomAuswahl = new Random();
int zufallsZahl = randomAuswahl.Next(optionen.Length);
string computerWahl = ;

Console.WriteLine("");



//-------- 4. Auswertung der gewählten Optionen -------- 
/* 
die Auswertung findet hier statt, 
d.h. die Wahl des Spielers muss mit der Wahl des Computers verglichen werden (bsp.: computerWahl == Schere)
und soll in folgenden drei verschiedenen bool Werten gespeichert werden!

vervollständige "istUnentschieden", "istSpielerSieg" und "istComputerSieg"
*/

bool istUnentschieden = ;
bool istSpielerSieg = ;
bool istComputerSieg = ;



//-------- 5. Ende des Spiels -------- 
/* 
Ende des Spiels,
je nach Gewinner soll hier eine andere Nachricht ausgegeben werden
*/

Console.WriteLine("");
