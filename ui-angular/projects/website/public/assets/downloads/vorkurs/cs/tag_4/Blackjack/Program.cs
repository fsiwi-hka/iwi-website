using System;

class Program
{
    static void Main()
    {
        Random rand = new Random();
        int playerTotal = 0;
        int bankTotal = 0;
        bool playerDone = false;
        int balance = 1000;

        int howManyRounds = 5;
        Console.WriteLine("Willkommen zu Blackjack!\n");

        for (int i = 0; i < howManyRounds; i++)
        {
            playerTotal = 0;
            bankTotal = 0;

            Console.WriteLine($"{i + 1}. Runde");
            Console.WriteLine($"Kontostand: {balance}");

            int bet;
            while (true)
            {
                Console.Write("Setze deinen Einsatz: ");
                if (int.TryParse(Console.ReadLine(), out bet) && bet > 0 && bet <= balance)
                    break;
                Console.WriteLine("Ungültiger Einsatz!");
            }
            balance -= bet;

            // Beide starten mit einer Karte
            playerTotal += rand.Next(1, 12);
            bankTotal += rand.Next(1, 12);

            while (true)
            {
                Console.WriteLine($"\nDein Stand: {playerTotal} | Bank: {bankTotal}");

                if (!playerDone)
                {
                    Console.Write("Hit or stand? (j/n): ");
                    string choice = Console.ReadLine()?.ToLower();
                    if (choice == "j") playerTotal += rand.Next(1, 12);
                    else playerDone = true;
                }

                if (bankTotal < 17)
                    bankTotal += rand.Next(1, 12);

                if (playerTotal >= 21 || bankTotal >= 21 || (playerDone && bankTotal >= 17))
                    break;
            }

            Console.WriteLine();
            Console.WriteLine("========================================");
            Console.WriteLine($"Endstand: Du {playerTotal} | Bank {bankTotal}");

            if (playerTotal == 21)

            {
                Console.WriteLine("🎉 Blackjack! Du gewinnst!");
                balance += (int)(bet * 2.5);
                Console.WriteLine("========================================");

            }
            else if (bankTotal == 21)
            {

                Console.WriteLine("😢Bank hat Blackjack! Bank gewinnt! :(");
                Console.WriteLine("========================================");
            }
            else if (playerTotal > 21 && bankTotal > 21)
            {
                Console.WriteLine("💥 Beide überkauft! Niemand gewinnt.");
                Console.WriteLine("========================================");
            }
            else if (playerTotal > 21)
            {
                Console.WriteLine("💥 Überkauft! Bank gewinnt. :(");
                Console.WriteLine("========================================");
            }
            else if (bankTotal > 21)
            {
                Console.WriteLine("🎉 Bank überkauft! Du gewinnst!");
                balance += bet * 2;
                Console.WriteLine("========================================");
            }
            else if (playerTotal > bankTotal)
            {
                Console.WriteLine("🎉 Du gewinnst!");
                balance += bet * 2;
                Console.WriteLine("========================================");
            }
            else if (playerTotal == bankTotal)
            {
                Console.WriteLine("🤝 Unentschieden!");
                balance += bet; // Einsatz zurück
                Console.WriteLine("========================================");
            }
            else
            {
                Console.WriteLine("😢 Bank gewinnt! :(");
                Console.WriteLine("========================================");
            }

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine($"Balance: {balance}");
            Console.ForegroundColor = ConsoleColor.White;
            if (balance <= 0) break;

            Console.WriteLine("Nächste Runde?");
            Console.WriteLine();
            playerDone = false;
        }

        if (balance > 1000) Console.WriteLine($"Das Profit, lets go");
        Console.WriteLine($"Balance: {balance} Game Over");
    }
}