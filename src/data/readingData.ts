// src/data/readingData.ts

export const readingTest = {
  id: "ielts_mock_stepwells_full",
  title: "Stepwells",
  text: `A millennium ago, stepwells were fundamental to life in the driest parts of India. Although many have been neglected, recent restoration has returned them to their former glory. Richard Cox travelled to north-western India to document these spectacular monuments from a bygone era.

During the sixth and seventh centuries, the inhabitants of the modern-day states of Gujarat and Rajasthan in North-western India developed a method of gaining access to clean, fresh groundwater during the dry season for drinking, bathing, watering animals and irrigation. However, the significance of this invention – the stepwell – goes beyond its utilitarian application.

Unique to the region, stepwells are often architecturally complex and vary widely in size and shape. During their heyday, they were places of gathering, of leisure, of relaxation and of worship for villagers of all but the lowest castes. Most stepwells are found dotted around the desert areas of Gujarat (where they are called vav) and Rajasthan (where they are known as baori), while a few also survive in Delhi. Some were located in or near villages as public spaces for the community; others were positioned beside roads as resting places for travellers.

As their name suggests, stepwells comprise a series of stone steps descending from ground level to the water source (normally an underground aquifer) as it recedes following the rains. When the water level was high, the user needed only to descend a few steps to reach it; when it was low, several levels would have to be negotiated.

Some wells are vast, open craters with hundreds of steps paving each sloping side, often in tiers. Others are more elaborate, with long stepped passages leading to the water via several storeys. Built from stone and supported by pillars, they also included pavilions that sheltered visitors from the relentless heat. But perhaps the most impressive features are the intricate decorative sculptures that embellish many stepwells, showing activities from fighting and dancing to everyday acts such as women combing their hair and churning butter.

Down the centuries, thousands of wells were constructed throughout northwestern India, but the majority have now fallen into disuse; many are derelict and dry, as groundwater has been diverted for industrial use and the wells no longer reach the water table. Their condition hasn’t been helped by recent dry spells: southern Rajasthan suffered an eight-year drought between 1996 and 2004.

However, some important sites in Gujarat have recently undergone major restoration, and the state government announced in June last year that it plans to restore the stepwells throughout the state.

In Patan, the state’s ancient capital, the stepwell of Rani Ki Vav (Queen’s Stepwell) is perhaps the finest current example. It was built by Queen Udayamati during the late 11th century, but became silted up following a flood during the 13th century. But the Archaeological Survey of India began restoring it in the 1960s, and today it’s in pristine condition. At 65 metres long, 20 metres wide and 27 metres deep, Rani Ki Vav features 500 distinct sculptures carved into niches throughout the monument, depicting gods such as Vishnu and Parvati in various incarnations. Incredibly, in January 2001, this ancient structure survived a devastating earthquake that measured 7.6 on the Richter scale.

Another example is the Surya Kund in Modhera, northern Gujarat, next to the Sun Temple, built by King Bhima I in 1026 to honour the sun god Surya. It’s actually a tank (kund means reservoir or pond) rather than a well, but displays the hallmarks of stepwell architecture, including four sides of steps that descend to the bottom in a stunning geometrical formation. The terraces house 108 small, intricately carved shrines between the sets of steps.

Rajasthan also has a wealth of wells. The ancient city of Bundi, 200 kilometres south of Jaipur, is renowned for its architecture, including its stepwells. One of the larger examples is Raniji Ki Baori, which was built by the queen of the region, Nathavatji, in 1699. At 46 metres deep, 20 metres wide and 40 metres long, the intricately carved monument is one of 21 baoris commissioned in the Bundi area by Nathavatji.

In the old ruined town of Abhaneri, about 95 kilometres east of Jaipur, is Chand Baori, one of India’s oldest and deepest wells; aesthetically, it’s perhaps one of the most dramatic. Built in around 850 AD next to the temple of Harshat Mata, the baori comprises hundreds of zigzagging steps that run along three of its sides, steeply descending 11 storeys, resulting in a striking geometric pattern when seen from afar. On the fourth side, covered verandas supported by ornate pillars overlook the steps.

Still in public use is Neemrana Ki Baori, located just off the Jaipur–Dehli highway. Constructed in around 1700, it’s nine storeys deep, with the last two levels underwater. At ground level, there are 86 colonnaded openings from where the visitor descends 170 steps to the deepest water source.`,
  
  questions: [
    { id: 1, type: "multiple_choice", question: "1. Examples of ancient stepwells can be found all over the world.", options: ["True", "False", "Not Given"], correctAnswer: "False" },
    { id: 2, type: "multiple_choice", question: "2. Stepwells had a range of functions, in addition to those related to water collection.", options: ["True", "False", "Not Given"], correctAnswer: "True" },
    { id: 3, type: "multiple_choice", question: "3. The few existing stepwells in Delhi are more attractive than those found elsewhere.", options: ["True", "False", "Not Given"], correctAnswer: "Not Given" },
    { id: 4, type: "multiple_choice", question: "4. It took workers many years to build the stone steps characteristic of stepwells.", options: ["True", "False", "Not Given"], correctAnswer: "Not Given" },
    { id: 5, type: "multiple_choice", question: "5. The number of steps above the water level in a stepwell altered during the course of a year.", options: ["True", "False", "Not Given"], correctAnswer: "True" },
    
    // Новые типы вопросов - текстовый ввод (ONE WORD ONLY)
    { id: 6, type: "text_input", question: "6. Which part of some stepwells provided shade for people?", correctAnswer: "pavilions" },
    { id: 7, type: "text_input", question: "7. What type of serious climatic event, which took place in southern Rajasthan, is mentioned in the article?", correctAnswer: "drought" },
    { id: 8, type: "text_input", question: "8. Who are frequent visitors to stepwells nowadays?", correctAnswer: "tourists" },
    
    // Вопросы из таблицы (Table Completion)
    { id: 9, type: "text_input", question: "9. Rani Ki Vav: Restored in the 1960s. Excellent condition, despite the ___ of 2001.", correctAnswer: "earthquake" },
    { id: 10, type: "text_input", question: "10. Surya Kund: Steps on the ___ produce a geometric pattern.", correctAnswer: "four sides" }, // Допустим небольшое отклонение
    { id: 11, type: "text_input", question: "11. Surya Kund: Looks more like a ___ than a well.", correctAnswer: "tank" },
    { id: 12, type: "text_input", question: "12. Chand Baori: Has ___ which provide a view to the steps.", correctAnswer: "verandas" },
    { id: 13, type: "text_input", question: "13. Neemrana Ki Baori: Has two ___ levels.", correctAnswer: "underwater" }
  ]
};