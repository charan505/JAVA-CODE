package com.disaster.config;

import com.disaster.model.*;
import com.disaster.repository.AlertReadStatusRepository;
import com.disaster.repository.DisasterAlertRepository;
import com.disaster.repository.SafetyGuidelineRepository;
import com.disaster.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final DisasterAlertRepository alertRepository;
    private final AlertReadStatusRepository alertReadStatusRepository;
    private final SafetyGuidelineRepository guidelineRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      DisasterAlertRepository alertRepository,
                      AlertReadStatusRepository alertReadStatusRepository,
                      SafetyGuidelineRepository guidelineRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.alertRepository = alertRepository;
        this.alertReadStatusRepository = alertReadStatusRepository;
        this.guidelineRepository = guidelineRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsersAndAlerts();
        seedSafetyGuidelines();
    }

    private void seedUsersAndAlerts() {
        if (userRepository.count() > 0) {
            logger.info("Database already seeded with user data.");
            return;
        }

        logger.info("Seeding initial users and disaster alerts...");

        // 1. Admin
        User admin = new User(
                "Emergency Command Director",
                "admin@disaster.org",
                passwordEncoder.encode("Admin@123"),
                "Central Command HQ",
                "+1 (555) 911-0000",
                Role.ROLE_ADMIN,
                AccountStatus.ACTIVE
        );
        admin = userRepository.save(admin);

        // 2. Community Users
        User sarah = userRepository.save(new User(
                "Sarah Chen",
                "sarah.chen@example.com",
                passwordEncoder.encode("User@123"),
                "Coastal Region Alpha",
                "+1 (555) 234-5678",
                Role.ROLE_COMMUNITY_USER,
                AccountStatus.ACTIVE
        ));

        User marcus = userRepository.save(new User(
                "Marcus Vance",
                "marcus.vance@example.com",
                passwordEncoder.encode("User@123"),
                "Mountain Valley District",
                "+1 (555) 345-6789",
                Role.ROLE_COMMUNITY_USER,
                AccountStatus.ACTIVE
        ));

        User priya = userRepository.save(new User(
                "Priya Patel",
                "priya.patel@example.com",
                passwordEncoder.encode("User@123"),
                "River Basin Zone",
                "+1 (555) 456-7890",
                Role.ROLE_COMMUNITY_USER,
                AccountStatus.ACTIVE
        ));

        User david = userRepository.save(new User(
                "David Kim",
                "david.kim@example.com",
                passwordEncoder.encode("User@123"),
                "Metro Central",
                "+1 (555) 567-8901",
                Role.ROLE_COMMUNITY_USER,
                AccountStatus.ACTIVE
        ));

        User elena = userRepository.save(new User(
                "Elena Rostova",
                "elena.rostova@example.com",
                passwordEncoder.encode("User@123"),
                "Highland Ridge",
                "+1 (555) 678-9012",
                Role.ROLE_COMMUNITY_USER,
                AccountStatus.ACTIVE
        ));

        User james = userRepository.save(new User(
                "James Wilson",
                "james.wilson@example.com",
                passwordEncoder.encode("User@123"),
                "Coastal Region Alpha",
                "+1 (555) 789-0123",
                Role.ROLE_COMMUNITY_USER,
                AccountStatus.INACTIVE
        ));

        // 3. Disaster Alerts
        LocalDateTime now = LocalDateTime.now();

        DisasterAlert alert1 = alertRepository.save(new DisasterAlert(
                DisasterType.FLOOD,
                "Urgent Flash Flood & Dam Spill Overtopping Alert",
                "Continuous torrential downpours have breached riverbanks at Sector 4. Dam reservoir levels exceed 98% capacity with emergency sluice discharge active. Low-lying communities face imminent inundation.",
                "River Basin Zone",
                SeverityLevel.CRITICAL,
                now.minusMinutes(45),
                "1. Immediately evacuate to designated high-ground shelters (Sector 4 Municipal Complex).\n2. Do not attempt to drive or walk through moving water.\n3. Shut off main circuit breakers and gas supply valves.\n4. Keep emergency go-bags, drinking water, and battery radios ready.",
                AlertStatus.ACTIVE,
                admin
        ));

        DisasterAlert alert2 = alertRepository.save(new DisasterAlert(
                DisasterType.CYCLONE,
                "Category 4 Cyclone 'Vayu' Coastal Landfall Alert",
                "Super Cyclone Vayu is tracking rapidly toward the eastern coastline with sustained wind gusts exceeding 210 km/h and projected storm surges of 4 to 6 meters. Mandatory coastal evacuation order is in effect.",
                "Coastal Region Alpha",
                SeverityLevel.CRITICAL,
                now.minusHours(3),
                "1. Board and reinforce all windows and secure loose outdoor structures.\n2. Evacuate coastal low-lying belts immediately to inland storm shelters.\n3. Remain in sturdy interior rooms without glass during eye passage.\n4. Keep satellite/battery radio tuned to 94.5 FM Emergency Band.",
                AlertStatus.ACTIVE,
                admin
        ));

        DisasterAlert alert3 = alertRepository.save(new DisasterAlert(
                DisasterType.FIRE,
                "Wildfire Approaching Residential Forest Buffer",
                "Fast-moving brush fire propelled by 45 km/h canyon winds is expanding towards North Ridge neighborhood. Air quality is severely compromised with heavy ash fallout.",
                "Mountain Valley District",
                SeverityLevel.HIGH,
                now.minusHours(6),
                "1. Clear combustible porch furniture, wood piles, and dry foliage from perimeter.\n2. Keep vehicle pointed forward in driveway with car windows rolled up.\n3. Wear N95 masks or wet cloth coverings to prevent smoke inhalation.\n4. Follow designated evacuation route Highway 7 North.",
                AlertStatus.ACTIVE,
                admin
        ));

        DisasterAlert alert4 = alertRepository.save(new DisasterAlert(
                DisasterType.EARTHQUAKE,
                "Magnitude 5.4 Tremors Detected - Aftershock Watch",
                "Seismic monitoring stations recorded a 5.4 magnitude shallow tremor along the regional fault line. Structural rapid assessments are underway. Minor localized cracks reported.",
                "Highland Ridge",
                SeverityLevel.MEDIUM,
                now.minusHours(12),
                "1. Drop, Cover, and Hold On under sturdy furniture during active shaking.\n2. Extinguish all open flames and check for damaged gas or water lines.\n3. Stay clear of masonry chimneys, power lines, and brick facades.\n4. Do not use elevators under any circumstances.",
                AlertStatus.ACTIVE,
                admin
        ));

        DisasterAlert alert5 = alertRepository.save(new DisasterAlert(
                DisasterType.TSUNAMI,
                "Tsunami Evacuation Advisory for Low-lying Harbors",
                "Offshore 7.1 submarine earthquake triggered localized 1.8m harbor surge waves. Harbor barriers held firm and wave dissipation confirmed by maritime monitoring.",
                "Coastal Region Alpha",
                SeverityLevel.HIGH,
                now.minusDays(2),
                "1. Maritime vessels instructed to maintain offshore deep water positions.\n2. Avoid beaches, docks, and coastal promenades until full clearance.\n3. Follow civil defense sirens for return authorization.",
                AlertStatus.RESOLVED,
                admin
        ));

        DisasterAlert alert6 = alertRepository.save(new DisasterAlert(
                DisasterType.LANDSLIDE,
                "Monsoon Landslide Risk along Mountain Corridor",
                "Slope stabilization and boulder removal successfully completed by road maintenance units. Debris cleared from Highway 10 and retaining mesh secured.",
                "Mountain Valley District",
                SeverityLevel.MEDIUM,
                now.minusDays(4),
                "1. Exercise heightened caution while navigating hillside switchbacks.\n2. Watch for sudden drainage culvert overflows.\n3. Report soil creep or leaning utility poles to county dispatch.",
                AlertStatus.RESOLVED,
                admin
        ));

        DisasterAlert alert7 = alertRepository.save(new DisasterAlert(
                DisasterType.OTHER,
                "Dense Industrial Smoke & Air Quality Warning",
                "Smog inversion layer caused AQI to spike above 320. Environmental hazmat teams have contained the industrial vent leak.",
                "Metro Central",
                SeverityLevel.LOW,
                now.minusDays(7),
                "1. Keep residential windows and doors closed.\n2. Sensitive groups and children should limit vigorous outdoor activities.\n3. Use indoor HEPA filtration if available.",
                AlertStatus.EXPIRED,
                admin
        ));

        // 4. Seed Alert Read Statuses
        alertReadStatusRepository.save(new AlertReadStatus(sarah, alert2, now.minusHours(2)));
        alertReadStatusRepository.save(new AlertReadStatus(sarah, alert5, now.minusDays(2)));
        alertReadStatusRepository.save(new AlertReadStatus(priya, alert1, now.minusMinutes(30)));
        alertReadStatusRepository.save(new AlertReadStatus(marcus, alert3, now.minusHours(4)));
        alertReadStatusRepository.save(new AlertReadStatus(marcus, alert6, now.minusDays(3)));
        alertReadStatusRepository.save(new AlertReadStatus(elena, alert4, now.minusHours(10)));
        alertReadStatusRepository.save(new AlertReadStatus(david, alert7, now.minusDays(6)));

        logger.info("Successfully seeded users, alerts, and read receipts.");
    }

    private void seedSafetyGuidelines() {
        if (guidelineRepository.count() > 0) {
            return;
        }

        logger.info("Seeding safety guidelines for all disaster types...");

        List<SafetyGuideline> guidelines = List.of(
                new SafetyGuideline(
                        DisasterType.FLOOD,
                        "Flood Safety & Survival Protocol",
                        "Floods are among the most frequent and destructive natural hazards. Rapid flash floods can develop in minutes following heavy rainfall or dam failures.",
                        "[\"Move immediately to higher ground or upper floors of sturdy structures.\", \"Disconnect main electrical breaker and shut off gas connections before evacuating.\", \"Store clean drinking water in sealed containers (at least 3 gallons per person).\", \"Listen to local emergency radio broadcasts for authorized evacuation corridors.\", \"Keep waterproof emergency go-bags with essential medicines, documents, and cash ready.\"]",
                        "[\"Never walk, swim, or drive through moving flood waters (6 inches of rushing water can knock you down, 12 inches can carry away a vehicle).\", \"Do not touch downed power lines or electrical equipment standing in water.\", \"Do not consume food or water that has come into contact with floodwater.\", \"Do not ignore official evacuation orders.\"]",
                        "[\"Waterproof flashlight + extra batteries\", \"Portable NOAA/FM emergency radio\", \"3-day supply of non-perishable food & water purification tablets\", \"First aid kit, prescription medicines & thermal emergency blankets\", \"Whistle to signal rescue teams\", \"Waterproof pouch for government IDs and land deeds\"]",
                        "Waves",
                        1
                ),
                new SafetyGuideline(
                        DisasterType.CYCLONE,
                        "Cyclone & Hurricane Preparedness Manual",
                        "Cyclones produce violent sustained winds, torrential rains, and dangerous coastal storm surges capable of massive structural devastation.",
                        "[\"Board up windows with plywood shutters or security storm tape.\", \"Secure or bring indoors all outdoor furniture, tin roofing sheets, and loose debris.\", \"Identify the safest interior room (bathroom, hallway, under stairwell) away from glass windows.\", \"Fully charge all phones, battery banks, solar torches, and medical devices.\", \"Turn refrigerators to the coldest setting to preserve perishable food in case of prolonged blackout.\"]",
                        "[\"Do not venture outdoors during the 'eye of the storm' when winds temporarily calm; the other half will strike suddenly from the opposite direction.\", \"Do not shelter in makeshift tin-roof sheds or under large trees.\", \"Do not park vehicles under power lines, billboards, or old trees.\", \"Do not spread unverified rumors on social media.\"]",
                        "[\"Heavy-duty tarpaulins & rope\", \"Battery-powered lanterns and headlamps\", \"Multi-tool knife and work gloves\", \"Dry ration food supplies (high-energy bars, biscuits, nuts)\", \"Sanitary wipes and emergency disinfectant\", \"Matchboxes/lighters in waterproof ziplock bags\"]",
                        "Wind",
                        2
                ),
                new SafetyGuideline(
                        DisasterType.EARTHQUAKE,
                        "Earthquake Action & Survival Guide",
                        "Earthquakes occur without prior warning. Rapid involuntary reactions are vital to protect against falling debris and structural collapse.",
                        "[\"DROP to hands and knees; COVER your head and neck under a sturdy desk or table; HOLD ON until shaking ceases.\", \"If outdoors, move away from tall buildings, glass facades, streetlights, and utility wires into open spaces.\", \"If driving, pull over safely away from overpasses and bridges and remain inside the vehicle.\", \"Check gas lines, water pipes, and electrical panels for rupture after the tremor stops.\", \"Expect and prepare for subsequent aftershocks.\"]",
                        "[\"Do not run outside during active shaking — falling glass and masonry are the primary causes of injury.\", \"Do not stand under doorways (modern doorframes are no stronger than the rest of the house).\", \"Do not use elevators during or after tremors until certified safe.\", \"Do not light matches or use open flames if you smell natural gas.\"]",
                        "[\"Durable hard hat or protective helmet\", \"Heavy-duty leather work gloves\", \"Sturdy closed-toe boots with puncture-resistant soles\", \"Crescent wrench or tool to shut off gas meter valves\", \"High-decibel emergency whistle\", \"Portable power bank and AM/FM solar radio\"]",
                        "Activity",
                        3
                ),
                new SafetyGuideline(
                        DisasterType.FIRE,
                        "Wildfire & Structural Fire Emergency Guide",
                        "Fires can spread at extreme velocity. Early detection, smoke avoidance, and rapid evacuation are critical to survival.",
                        "[\"Remember STOP, DROP, and ROLL if clothing catches fire.\", \"Crawl low under smoke — clean, breathable air remains closer to the floor.\", \"Feel door surfaces and metal knobs with the back of your hand before opening; if hot, use an alternate exit.\", \"Use the P.A.S.S. technique for fire extinguishers: Pull pin, Aim nozzle, Squeeze handle, Sweep side-to-side.\", \"Establish a predetermined family meeting point safely outside the perimeter.\"]",
                        "[\"Do not go back inside a burning building for pets or possessions once evacuated.\", \"Do not use water on electrical or grease/oil fires (use baking soda, fire blanket, or Class B/C extinguisher).\", \"Do not open windows if a wildfire is approaching, as drafts pull flames inside.\", \"Do not delay evacuation if authorities issue a wildfire advisory.\"]",
                        "[\"N95 particulate respirator masks or fire hoods\", \"Fire blankets and ABC-rated fire extinguisher\", \"Flame-resistant clothing (cotton or wool, avoid synthetics)\", \"High-lumen flashlight for smoke navigation\", \"Detailed topographic/neighborhood evacuation maps\", \"Burn gel dressings and sterile gauze bandage rolls\"]",
                        "Flame",
                        4
                ),
                new SafetyGuideline(
                        DisasterType.LANDSLIDE,
                        "Landslide & Debris Flow Precautions",
                        "Landslides, mudslides, and rockfalls are triggered by heavy precipitation, slope destabilization, seismic activity, or human excavation.",
                        "[\"Stay alert to unusual sounds like cracking trees, rolling boulders, or sudden bursts of muddy river flow.\", \"Evacuate perpendicular to the path of the flow, moving uphill and away from ravines and gullies.\", \"Keep drainage ditches and hillside retaining culverts clear of leaves and sediment before rainstorms.\", \"Watch for signs of ground movement: tilted fences, leaning trees, or newly appearing cracks in foundations.\", \"If trapped inside with no escape, curl into a tight ball and protect your head.\"]",
                        "[\"Do not build or stay near steep slopes, drainage channels, or natural erosion gullies during monsoons.\", \"Do not cross bridges or riverbeds when water turns heavily turbid and carries tree logs.\", \"Do not return to a landslide area immediately; secondary slides often occur.\"]",
                        "[\"Loud signaling horn or whistle\", \"Heavy-duty shovel and pry bar\", \"High-traction hiking boots\", \"Reflective safety vests\", \"First aid supplies for trauma and fractures\", \"Headlamps and long-lasting emergency glow sticks\"]",
                        "Mountain",
                        5
                ),
                new SafetyGuideline(
                        DisasterType.TSUNAMI,
                        "Tsunami Early Warning & Coastal Evacuation",
                        "Tsunamis are catastrophic ocean wave trains generated by undersea earthquakes, volcanic eruptions, or coastal landslides. The first wave is rarely the largest.",
                        "[\"If you feel strong coastal shaking or notice sudden sea withdrawal exposing the ocean bed, evacuate immediately.\", \"Run immediately inland to high ground (at least 30 meters / 100 feet above sea level or 3 km inland).\", \"If trapped in a multi-story concrete hotel/building, move to the 3rd floor or higher roof level as a last resort.\", \"Stay tuned to regional tsunami advisory sirens and port authority radio channels.\", \"Remain on high ground for several hours until official 'All Clear' is sounded.\"]",
                        "[\"Never go down to the shore to watch the incoming tsunami wave or explore exposed seabed reefs.\", \"Do not assume the danger is over after the first wave — subsequent waves may arrive 10 to 45 minutes apart and be significantly larger.\", \"Do not return to low-lying ports or beaches until civil emergency authorities officially issue clearance.\"]",
                        "[\"Life jackets / personal flotation devices (PFD)\", \"Dry bag with emergency rations & fresh water\", \"Emergency thermal foil blankets\", \"Solar/crank radio & waterproof signal strobe\", \"Essential identity documents in dual watertight casings\"]",
                        "ShieldAlert",
                        6
                ),
                new SafetyGuideline(
                        DisasterType.OTHER,
                        "General Emergency & Hazardous Incident Guidelines",
                        "Guidelines for chemical spills, technological failures, severe storms, heatwaves, or unexpected community emergencies.",
                        "[\"Stay informed through official civil defense emergency channels.\", \"Shelter-in-place when hazardous environmental conditions occur.\", \"Maintain 72-hour emergency survival kits for all household members including pets.\", \"Assist elderly neighbors and individuals with mobility challenges.\", \"Memorize local emergency helpline numbers (112 / 911 / Disaster Management HQ).\"]",
                        "[\"Do not spread unverified hearsay or misinformation.\", \"Do not overload emergency telephone networks with non-urgent queries.\", \"Do not approach unidentified containers or chemical spills.\"]",
                        "[\"Multi-purpose survival tool\", \"Emergency cash in small denominations\", \"Power banks & solar charging panel\", \"Hygiene supplies & sanitary kits\", \"Emergency contact directory notebook\"]",
                        "AlertTriangle",
                        7
                )
        );

        guidelineRepository.saveAll(guidelines);
        logger.info("Successfully seeded 7 disaster safety guidelines.");
    }
}
