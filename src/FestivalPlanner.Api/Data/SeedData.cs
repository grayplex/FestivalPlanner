using FestivalPlanner.Api.Models;

namespace FestivalPlanner.Api.Data;

public static class SeedData
{
    public static List<string> GetStages() => new()
    {
        "Stadium: Evolved",
        "The Shipyard 360",
        "Mega Vega",
        "Fire Pit",
        "Chill Dome",
        "Silent Disco",
        "Club Coast"
    };

    public static List<string> GetTimeSlots() => new()
    {
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
        "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
        "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"
    };

    public static List<Artist> GetArtists()
    {
        var artists = new List<Artist>();
        int id = 1;

        // Day One - August 29, 2025
        // Stadium: Evolved
        artists.Add(new Artist { Id = id++, Name = "Tombz", Date = "2025-08-29", StartTime = "16:10", EndTime = "17:10", Stage = "Stadium: Evolved" });
        artists.Add(new Artist { Id = id++, Name = "Oppidan", Date = "2025-08-29", StartTime = "17:10", EndTime = "18:10", Stage = "Stadium: Evolved" });
        artists.Add(new Artist { Id = id++, Name = "Wax Motif", Date = "2025-08-29", StartTime = "18:10", EndTime = "19:25", Stage = "Stadium: Evolved" });
        artists.Add(new Artist { Id = id++, Name = "Tinlicker (DJ)", Date = "2025-08-29", StartTime = "19:25", EndTime = "20:40", Stage = "Stadium: Evolved" });
        artists.Add(new Artist { Id = id++, Name = "Louis The Chlid", Date = "2025-08-29", StartTime = "20:45", EndTime = "21:55", Stage = "Stadium: Evolved" });
        artists.Add(new Artist { Id = id++, Name = "Chris Lake", Date = "2025-08-29", StartTime = "22:00", EndTime = "00:00", Stage = "Stadium: Evolved" });

        // The Shipyard 360
        artists.Add(new Artist { Id = id++, Name = "Bobby Afterlife", Date = "2025-08-29", StartTime = "14:30", EndTime = "15:45", Stage = "The Shipyard 360" });
        artists.Add(new Artist { Id = id++, Name = "GAD'M", Date = "2025-08-29", StartTime = "15:45", EndTime = "16:45", Stage = "The Shipyard 360" });
        artists.Add(new Artist { Id = id++, Name = "SHERM", Date = "2025-08-29", StartTime = "16:45", EndTime = "17:45", Stage = "The Shipyard 360" });
        artists.Add(new Artist { Id = id++, Name = "Ian Asher", Date = "2025-08-29", StartTime = "17:45", EndTime = "18:45", Stage = "The Shipyard 360" });
        artists.Add(new Artist { Id = id++, Name = "Benny Benassi", Date = "2025-08-29", StartTime = "18:45", EndTime = "19:45", Stage = "The Shipyard 360" });
        artists.Add(new Artist { Id = id++, Name = "Galantis", Date = "2025-08-29", StartTime = "19:55", EndTime = "21:10", Stage = "The Shipyard 360" });
        artists.Add(new Artist { Id = id++, Name = "Kaskade", Date = "2025-08-29", StartTime = "21:15", EndTime = "22:45", Stage = "The Shipyard 360" });

        // Mega Vega
        artists.Add(new Artist { Id = id++, Name = "Doubled", Date = "2025-08-29", StartTime = "14:30", EndTime = "15:30", Stage = "Mega Vega" });
        artists.Add(new Artist { Id = id++, Name = "Malfunktion", Date = "2025-08-29", StartTime = "15:30", EndTime = "16:30", Stage = "Mega Vega" });
        artists.Add(new Artist { Id = id++, Name = "Caster", Date = "2025-08-29", StartTime = "16:30", EndTime = "17:30", Stage = "Mega Vega" });
        artists.Add(new Artist { Id = id++, Name = "Yookie", Date = "2025-08-29", StartTime = "17:30", EndTime = "18:30", Stage = "Mega Vega" });
        artists.Add(new Artist { Id = id++, Name = "Infekt", Date = "2025-08-29", StartTime = "18:30", EndTime = "19:30", Stage = "Mega Vega" });
        artists.Add(new Artist { Id = id++, Name = "Ray Volpe", Date = "2025-08-29", StartTime = "19:30", EndTime = "20:30", Stage = "Mega Vega" });
        artists.Add(new Artist { Id = id++, Name = "Kai Wachi", Date = "2025-08-29", StartTime = "20:35", EndTime = "21:35", Stage = "Mega Vega" });
        artists.Add(new Artist { Id = id++, Name = "Voyd", Date = "2025-08-29", StartTime = "21:45", EndTime = "23:00", Stage = "Mega Vega" });

        // Fire Pit
        artists.Add(new Artist { Id = id++, Name = "D@tu X Yobi", Date = "2025-08-29", StartTime = "14:00", EndTime = "14:45", Stage = "Fire Pit" });
        artists.Add(new Artist { Id = id++, Name = "Parti", Date = "2025-08-29", StartTime = "14:45", EndTime = "15:30", Stage = "Fire Pit" });
        artists.Add(new Artist { Id = id++, Name = "Raakmo", Date = "2025-08-29", StartTime = "15:30", EndTime = "16:15", Stage = "Fire Pit" });
        artists.Add(new Artist { Id = id++, Name = "Rocky", Date = "2025-08-29", StartTime = "16:15", EndTime = "17:00", Stage = "Fire Pit" });
        artists.Add(new Artist { Id = id++, Name = "Kreation", Date = "2025-08-29", StartTime = "17:00", EndTime = "18:00", Stage = "Fire Pit" });
        artists.Add(new Artist { Id = id++, Name = "Waterspirit", Date = "2025-08-29", StartTime = "18:00", EndTime = "19:00", Stage = "Fire Pit" });
        artists.Add(new Artist { Id = id++, Name = "Darksiderz", Date = "2025-08-29", StartTime = "19:00", EndTime = "20:00", Stage = "Fire Pit" });
        artists.Add(new Artist { Id = id++, Name = "Audiofreq", Date = "2025-08-29", StartTime = "20:00", EndTime = "21:00", Stage = "Fire Pit" });
        artists.Add(new Artist { Id = id++, Name = "Lil Texas", Date = "2025-08-29", StartTime = "21:00", EndTime = "22:00", Stage = "Fire Pit" });

        // Chill Dome
        artists.Add(new Artist { Id = id++, Name = "Kdin", Date = "2025-08-29", StartTime = "14:00", EndTime = "15:00", Stage = "Chill Dome" });
        artists.Add(new Artist { Id = id++, Name = "Komprezzor", Date = "2025-08-29", StartTime = "15:00", EndTime = "16:00", Stage = "Chill Dome" });
        artists.Add(new Artist { Id = id++, Name = "Svdden Death: Deadroom", Date = "2025-08-29", StartTime = "16:00", EndTime = "17:00", Stage = "Chill Dome" });
        artists.Add(new Artist { Id = id++, Name = "Kula", Date = "2025-08-29", StartTime = "17:00", EndTime = "18:00", Stage = "Chill Dome" });
        artists.Add(new Artist { Id = id++, Name = "Palo", Date = "2025-08-29", StartTime = "18:00", EndTime = "19:15", Stage = "Chill Dome" });
        artists.Add(new Artist { Id = id++, Name = "Zorza", Date = "2025-08-29", StartTime = "19:15", EndTime = "20:30", Stage = "Chill Dome" });
        artists.Add(new Artist { Id = id++, Name = "Neek", Date = "2025-08-29", StartTime = "20:30", EndTime = "21:45", Stage = "Chill Dome" });

        // Silent Disco
        artists.Add(new Artist { Id = id++, Name = "Kakashi B2b Jovas", Date = "2025-08-29", StartTime = "14:30", EndTime = "15:30", Stage = "Silent Disco" });
        artists.Add(new Artist { Id = id++, Name = "Mystery Box", Date = "2025-08-29", StartTime = "15:30", EndTime = "16:45", Stage = "Silent Disco" });
        artists.Add(new Artist { Id = id++, Name = "Teryx", Date = "2025-08-29", StartTime = "16:45", EndTime = "18:00", Stage = "Silent Disco" });
        artists.Add(new Artist { Id = id++, Name = "Spydr b2b Trvshed", Date = "2025-08-29", StartTime = "18:00", EndTime = "19:15", Stage = "Silent Disco" });
        artists.Add(new Artist { Id = id++, Name = "Bubzie b2b Skampa", Date = "2025-08-29", StartTime = "19:15", EndTime = "20:30", Stage = "Silent Disco" });
        artists.Add(new Artist { Id = id++, Name = "Cyber Capone", Date = "2025-08-29", StartTime = "20:30", EndTime = "21:45", Stage = "Silent Disco" });
        artists.Add(new Artist { Id = id++, Name = "Remorse", Date = "2025-08-29", StartTime = "21:45", EndTime = "23:00", Stage = "Silent Disco" });

        // Club Coast
        artists.Add(new Artist { Id = id++, Name = "Heily Beatz", Date = "2025-08-29", StartTime = "16:00", EndTime = "17:00", Stage = "Club Coast" });
        artists.Add(new Artist { Id = id++, Name = "DJ Goose", Date = "2025-08-29", StartTime = "17:00", EndTime = "18:00", Stage = "Club Coast" });
        artists.Add(new Artist { Id = id++, Name = "Crwns", Date = "2025-08-29", StartTime = "18:00", EndTime = "19:00", Stage = "Club Coast" });
        artists.Add(new Artist { Id = id++, Name = "Mosborne", Date = "2025-08-29", StartTime = "19:00", EndTime = "20:00", Stage = "Club Coast" });
        artists.Add(new Artist { Id = id++, Name = "Sweet n Sour", Date = "2025-08-29", StartTime = "20:00", EndTime = "21:00", Stage = "Club Coast" });
        artists.Add(new Artist { Id = id++, Name = "Skyler", Date = "2025-08-29", StartTime = "21:00", EndTime = "22:00", Stage = "Club Coast" });

        // Day Two - August 30, 2025
        // Stadium: Evolved
        artists.Add(new Artist { Id = id++, Name = "Sylo", Date = "2025-08-30", StartTime = "15:00", EndTime = "16:00", Stage = "Stadium: Evolved" });
        artists.Add(new Artist { Id = id++, Name = "Dogma", Date = "2025-08-30", StartTime = "16:00", EndTime = "17:00", Stage = "Stadium: Evolved" });
        artists.Add(new Artist { Id = id++, Name = "Dennett", Date = "2025-08-30", StartTime = "17:00", EndTime = "18:00", Stage = "Stadium: Evolved" });
        artists.Add(new Artist { Id = id++, Name = "Jon Casey", Date = "2025-08-30", StartTime = "18:00", EndTime = "19:00", Stage = "Stadium: Evolved" });
        artists.Add(new Artist { Id = id++, Name = "Zingara", Date = "2025-08-30", StartTime = "19:00", EndTime = "20:00", Stage = "Stadium: Evolved" });
        artists.Add(new Artist { Id = id++, Name = "Nghtmre B2B Dimension", Date = "2025-08-30", StartTime = "20:05", EndTime = "21:20", Stage = "Stadium: Evolved" });
        artists.Add(new Artist { Id = id++, Name = "Atliens", Date = "2025-08-30", StartTime = "21:25", EndTime = "22:40", Stage = "Stadium: Evolved" });
        artists.Add(new Artist { Id = id++, Name = "Excision", Date = "2025-08-30", StartTime = "22:45", EndTime = "00:00", Stage = "Stadium: Evolved" });

        // The Shipyard 360
        artists.Add(new Artist { Id = id++, Name = "Confetti Mike", Date = "2025-08-30", StartTime = "14:30", EndTime = "15:30", Stage = "The Shipyard 360" });
        artists.Add(new Artist { Id = id++, Name = "Miriam", Date = "2025-08-30", StartTime = "15:30", EndTime = "16:30", Stage = "The Shipyard 360" });
        artists.Add(new Artist { Id = id++, Name = "Pods", Date = "2025-08-30", StartTime = "16:30", EndTime = "17:30", Stage = "The Shipyard 360" });
        artists.Add(new Artist { Id = id++, Name = "Kaleena Zanders", Date = "2025-08-30", StartTime = "17:30", EndTime = "18:30", Stage = "The Shipyard 360" });
        artists.Add(new Artist { Id = id++, Name = "Joshwa", Date = "2025-08-30", StartTime = "18:30", EndTime = "19:30", Stage = "The Shipyard 360" });
        artists.Add(new Artist { Id = id++, Name = "Westend", Date = "2025-08-30", StartTime = "19:30", EndTime = "20:30", Stage = "The Shipyard 360" });
        artists.Add(new Artist { Id = id++, Name = "LP Giobbi", Date = "2025-08-30", StartTime = "20:30", EndTime = "21:40", Stage = "The Shipyard 360" });
        artists.Add(new Artist { Id = id++, Name = "Sofi Tukker Wonderland", Date = "2025-08-30", StartTime = "21:45", EndTime = "23:00", Stage = "The Shipyard 360" });

        // Mega Vega
        artists.Add(new Artist { Id = id++, Name = "Tazu", Date = "2025-08-30", StartTime = "14:00", EndTime = "14:55", Stage = "Mega Vega" });
        artists.Add(new Artist { Id = id++, Name = "Celo", Date = "2025-08-30", StartTime = "14:55", EndTime = "15:55", Stage = "Mega Vega" });
        artists.Add(new Artist { Id = id++, Name = "Distinct Motive", Date = "2025-08-30", StartTime = "15:55", EndTime = "16:55", Stage = "Mega Vega" });
        artists.Add(new Artist { Id = id++, Name = "Detox Unit", Date = "2025-08-30", StartTime = "16:55", EndTime = "17:55", Stage = "Mega Vega" });
        artists.Add(new Artist { Id = id++, Name = "Peekaboo B2B Caspa", Date = "2025-08-30", StartTime = "17:55", EndTime = "18:55", Stage = "Mega Vega" });
        artists.Add(new Artist { Id = id++, Name = "Deadmau5 (DNB Set)", Date = "2025-08-30", StartTime = "19:00", EndTime = "20:05", Stage = "Mega Vega" });
        artists.Add(new Artist { Id = id++, Name = "Of The Trees", Date = "2025-08-30", StartTime = "20:10", EndTime = "21:25", Stage = "Mega Vega" });
        artists.Add(new Artist { Id = id++, Name = "Seven Lions", Date = "2025-08-30", StartTime = "21:30", EndTime = "22:45", Stage = "Mega Vega" });

        // Fire Pit
        artists.Add(new Artist { Id = id++, Name = "Kevin Alvarez B2B Lee Sandstrom", Date = "2025-08-30", StartTime = "14:45", EndTime = "15:30", Stage = "Fire Pit" });
        artists.Add(new Artist { Id = id++, Name = "INV3RT3D", Date = "2025-08-30", StartTime = "15:30", EndTime = "16:30", Stage = "Fire Pit" });
        artists.Add(new Artist { Id = id++, Name = "Silent Hype", Date = "2025-08-30", StartTime = "16:30", EndTime = "17:30", Stage = "Fire Pit" });
        artists.Add(new Artist { Id = id++, Name = "CLB", Date = "2025-08-30", StartTime = "17:30", EndTime = "18:30", Stage = "Fire Pit" });
        artists.Add(new Artist { Id = id++, Name = "Rohaan", Date = "2025-08-30", StartTime = "18:30", EndTime = "19:30", Stage = "Fire Pit" });
        artists.Add(new Artist { Id = id++, Name = "Muzz", Date = "2025-08-30", StartTime = "19:30", EndTime = "20:30", Stage = "Fire Pit" });
        artists.Add(new Artist { Id = id++, Name = "Skepsis", Date = "2025-08-30", StartTime = "20:30", EndTime = "21:30", Stage = "Fire Pit" });

        // Chill Dome
        artists.Add(new Artist { Id = id++, Name = "DJ Alissa JO Deep House Yoga", Date = "2025-08-30", StartTime = "14:30", EndTime = "15:45", Stage = "Chill Dome" });
        artists.Add(new Artist { Id = id++, Name = "Atliens OG Trap Set", Date = "2025-08-30", StartTime = "15:45", EndTime = "16:45", Stage = "Chill Dome" });
        artists.Add(new Artist { Id = id++, Name = "Nanoos", Date = "2025-08-30", StartTime = "16:45", EndTime = "17:45", Stage = "Chill Dome" });
        artists.Add(new Artist { Id = id++, Name = "Matt Wyser", Date = "2025-08-30", StartTime = "17:45", EndTime = "18:45", Stage = "Chill Dome" });
        artists.Add(new Artist { Id = id++, Name = "Audio Support Department", Date = "2025-08-30", StartTime = "18:45", EndTime = "19:45", Stage = "Chill Dome" });
        artists.Add(new Artist { Id = id++, Name = "Fiyafly", Date = "2025-08-30", StartTime = "19:45", EndTime = "20:45", Stage = "Chill Dome" });

        // Silent Disco
        artists.Add(new Artist { Id = id++, Name = "Tricat Meows", Date = "2025-08-30", StartTime = "14:30", EndTime = "15:30", Stage = "Silent Disco" });
        artists.Add(new Artist { Id = id++, Name = "Bre5lin", Date = "2025-08-30", StartTime = "15:30", EndTime = "16:45", Stage = "Silent Disco" });
        artists.Add(new Artist { Id = id++, Name = "GQueue", Date = "2025-08-30", StartTime = "16:45", EndTime = "18:00", Stage = "Silent Disco" });
        artists.Add(new Artist { Id = id++, Name = "Joe Mixin B2B Donnie Oz", Date = "2025-08-30", StartTime = "18:00", EndTime = "19:15", Stage = "Silent Disco" });
        artists.Add(new Artist { Id = id++, Name = "Lucy In The Sky", Date = "2025-08-30", StartTime = "19:15", EndTime = "20:30", Stage = "Silent Disco" });
        artists.Add(new Artist { Id = id++, Name = "Orlando Sounds", Date = "2025-08-30", StartTime = "20:30", EndTime = "21:45", Stage = "Silent Disco" });
        artists.Add(new Artist { Id = id++, Name = "WerO", Date = "2025-08-30", StartTime = "21:45", EndTime = "23:00", Stage = "Silent Disco" });

        // Club Coast
        artists.Add(new Artist { Id = id++, Name = "Joseph Junar", Date = "2025-08-30", StartTime = "16:00", EndTime = "17:00", Stage = "Club Coast" });
        artists.Add(new Artist { Id = id++, Name = "NsQuared", Date = "2025-08-30", StartTime = "17:00", EndTime = "18:00", Stage = "Club Coast" });
        artists.Add(new Artist { Id = id++, Name = "Witz", Date = "2025-08-30", StartTime = "18:00", EndTime = "19:00", Stage = "Club Coast" });
        artists.Add(new Artist { Id = id++, Name = "Dr. Mar", Date = "2025-08-30", StartTime = "19:00", EndTime = "20:00", Stage = "Club Coast" });
        artists.Add(new Artist { Id = id++, Name = "Absnth", Date = "2025-08-30", StartTime = "20:00", EndTime = "21:00", Stage = "Club Coast" });
        artists.Add(new Artist { Id = id++, Name = "Hashbbc", Date = "2025-08-30", StartTime = "21:00", EndTime = "22:00", Stage = "Club Coast" });

        // Day Three - August 31, 2025
        // Stadium: Evolved
        artists.Add(new Artist { Id = id++, Name = "Seth David", Date = "2025-08-31", StartTime = "16:00", EndTime = "16:40", Stage = "Stadium: Evolved" });
        artists.Add(new Artist { Id = id++, Name = "Heyz", Date = "2025-08-31", StartTime = "16:40", EndTime = "17:40", Stage = "Stadium: Evolved" });
        artists.Add(new Artist { Id = id++, Name = "Daily Bread", Date = "2025-08-31", StartTime = "17:40", EndTime = "18:40", Stage = "Stadium: Evolved" });
        artists.Add(new Artist { Id = id++, Name = "Liquid Stranger", Date = "2025-08-31", StartTime = "18:45", EndTime = "19:45", Stage = "Stadium: Evolved" });
        artists.Add(new Artist { Id = id++, Name = "Rezz", Date = "2025-08-31", StartTime = "19:55", EndTime = "21:05", Stage = "Stadium: Evolved" });
        artists.Add(new Artist { Id = id++, Name = "Zeds Dead", Date = "2025-08-31", StartTime = "21:15", EndTime = "22:30", Stage = "Stadium: Evolved" });

        // The Shipyard 360
        artists.Add(new Artist { Id = id++, Name = "Yung Singh", Date = "2025-08-31", StartTime = "14:00", EndTime = "15:25", Stage = "The Shipyard 360" });
        artists.Add(new Artist { Id = id++, Name = "Control Freak", Date = "2025-08-31", StartTime = "15:25", EndTime = "16:25", Stage = "The Shipyard 360" });
        artists.Add(new Artist { Id = id++, Name = "Taiki Nulight", Date = "2025-08-31", StartTime = "16:25", EndTime = "17:25", Stage = "The Shipyard 360" });
        artists.Add(new Artist { Id = id++, Name = "LYNY", Date = "2025-08-31", StartTime = "17:25", EndTime = "18:25", Stage = "The Shipyard 360" });
        artists.Add(new Artist { Id = id++, Name = "Juelz", Date = "2025-08-31", StartTime = "18:25", EndTime = "19:25", Stage = "The Shipyard 360" });
        artists.Add(new Artist { Id = id++, Name = "Apashe", Date = "2025-08-31", StartTime = "19:30", EndTime = "20:40", Stage = "The Shipyard 360" });
        artists.Add(new Artist { Id = id++, Name = "RL Grime", Date = "2025-08-31", StartTime = "20:45", EndTime = "22:00", Stage = "The Shipyard 360" });

        // Mega Vega
        artists.Add(new Artist { Id = id++, Name = "Drty Drty", Date = "2025-08-31", StartTime = "14:00", EndTime = "15:00", Stage = "Mega Vega" });
        artists.Add(new Artist { Id = id++, Name = "Orozco", Date = "2025-08-31", StartTime = "15:00", EndTime = "16:00", Stage = "Mega Vega" });
        artists.Add(new Artist { Id = id++, Name = "Mc4D", Date = "2025-08-31", StartTime = "16:00", EndTime = "17:00", Stage = "Mega Vega" });
        artists.Add(new Artist { Id = id++, Name = "Bonnie & Clyde", Date = "2025-08-31", StartTime = "17:00", EndTime = "18:00", Stage = "Mega Vega" });
        artists.Add(new Artist { Id = id++, Name = "Kream", Date = "2025-08-31", StartTime = "18:00", EndTime = "19:00", Stage = "Mega Vega" });
        artists.Add(new Artist { Id = id++, Name = "Timmy Trumpet", Date = "2025-08-31", StartTime = "19:05", EndTime = "20:20", Stage = "Mega Vega" });
        artists.Add(new Artist { Id = id++, Name = "Zedd", Date = "2025-08-31", StartTime = "20:30", EndTime = "21:45", Stage = "Mega Vega" });

        // Fire Pit
        artists.Add(new Artist { Id = id++, Name = "Zyn B2B Boris", Date = "2025-08-31", StartTime = "15:20", EndTime = "16:10", Stage = "Fire Pit" });
        artists.Add(new Artist { Id = id++, Name = "Swando B2B Brute", Date = "2025-08-31", StartTime = "16:10", EndTime = "17:00", Stage = "Fire Pit" });
        artists.Add(new Artist { Id = id++, Name = "Prosecute", Date = "2025-08-31", StartTime = "17:00", EndTime = "18:00", Stage = "Fire Pit" });
        artists.Add(new Artist { Id = id++, Name = "Pyke", Date = "2025-08-31", StartTime = "18:00", EndTime = "19:00", Stage = "Fire Pit" });
        artists.Add(new Artist { Id = id++, Name = "Vktm", Date = "2025-08-31", StartTime = "19:00", EndTime = "20:00", Stage = "Fire Pit" });
        artists.Add(new Artist { Id = id++, Name = "Blvnkspvce B2B Hamro B2B Sqishi", Date = "2025-08-31", StartTime = "20:00", EndTime = "21:00", Stage = "Fire Pit" });

        // Chill Dome
        artists.Add(new Artist { Id = id++, Name = "DJ Alissa JO Deep House Yoga", Date = "2025-08-31", StartTime = "14:30", EndTime = "15:30", Stage = "Chill Dome" });
        artists.Add(new Artist { Id = id++, Name = "Liquid Stranger B2B ???", Date = "2025-08-31", StartTime = "15:30", EndTime = "16:30", Stage = "Chill Dome" });
        artists.Add(new Artist { Id = id++, Name = "Yung Singh", Date = "2025-08-31", StartTime = "16:30", EndTime = "17:30", Stage = "Chill Dome" });
        artists.Add(new Artist { Id = id++, Name = "Intel", Date = "2025-08-31", StartTime = "17:30", EndTime = "18:30", Stage = "Chill Dome" });
        artists.Add(new Artist { Id = id++, Name = "Naughta", Date = "2025-08-31", StartTime = "18:30", EndTime = "19:30", Stage = "Chill Dome" });
        artists.Add(new Artist { Id = id++, Name = "Northside B2B L.Void", Date = "2025-08-31", StartTime = "19:30", EndTime = "20:30", Stage = "Chill Dome" });
        artists.Add(new Artist { Id = id++, Name = "Subverb", Date = "2025-08-31", StartTime = "20:30", EndTime = "21:30", Stage = "Chill Dome" });

        // Silent Disco
        artists.Add(new Artist { Id = id++, Name = "Datalore", Date = "2025-08-31", StartTime = "14:30", EndTime = "15:30", Stage = "Silent Disco" });
        artists.Add(new Artist { Id = id++, Name = "Turbo", Date = "2025-08-31", StartTime = "15:30", EndTime = "16:45", Stage = "Silent Disco" });
        artists.Add(new Artist { Id = id++, Name = "KCranium", Date = "2025-08-31", StartTime = "16:45", EndTime = "18:00", Stage = "Silent Disco" });
        artists.Add(new Artist { Id = id++, Name = "Nola", Date = "2025-08-31", StartTime = "18:00", EndTime = "19:00", Stage = "Silent Disco" });
        artists.Add(new Artist { Id = id++, Name = "Alex Wolf", Date = "2025-08-31", StartTime = "19:00", EndTime = "20:00", Stage = "Silent Disco" });
        artists.Add(new Artist { Id = id++, Name = "Systm Error", Date = "2025-08-31", StartTime = "20:00", EndTime = "21:00", Stage = "Silent Disco" });
        artists.Add(new Artist { Id = id++, Name = "Ray Callahan", Date = "2025-08-31", StartTime = "21:00", EndTime = "22:00", Stage = "Silent Disco" });

        // Club Coast
        artists.Add(new Artist { Id = id++, Name = "Jitch", Date = "2025-08-31", StartTime = "16:00", EndTime = "17:00", Stage = "Club Coast" });
        artists.Add(new Artist { Id = id++, Name = "Goonba", Date = "2025-08-31", StartTime = "17:00", EndTime = "18:00", Stage = "Club Coast" });
        artists.Add(new Artist { Id = id++, Name = "Jeliah", Date = "2025-08-31", StartTime = "18:00", EndTime = "19:00", Stage = "Club Coast" });
        artists.Add(new Artist { Id = id++, Name = "Vela-Fi", Date = "2025-08-31", StartTime = "19:00", EndTime = "20:00", Stage = "Club Coast" });
        artists.Add(new Artist { Id = id++, Name = "Desma", Date = "2025-08-31", StartTime = "20:00", EndTime = "21:00", Stage = "Club Coast" });
        artists.Add(new Artist { Id = id++, Name = "DB Stereo", Date = "2025-08-31", StartTime = "21:00", EndTime = "22:00", Stage = "Club Coast" });

        return artists;
    }
}
