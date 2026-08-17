import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Home, ClipboardList, Layers, Dumbbell, BarChart3, Bookmark, Flame, Settings,
  Search, Bell, ChevronDown, Trophy, Target, CheckCircle2, Clock, ArrowRight,
  X, Check, ChevronLeft, ChevronRight, Award, Info, RefreshCw, Calendar,
  TrendingUp, Sigma, Brain, BookOpen, Landmark, Shield, ChevronRight as ChevronRightIcon,
  Play, RotateCcw, PieChart, Sun, Moon, Menu
} from "lucide-react";

/* ============================================================
   THEME SYSTEM (dark = brand default, light = alt palette)
   ============================================================ */
const THEMES = {
  dark: {
    "--bg": "#050506",
    "--sidebar-bg": "#0a0a0b",
    "--card-bg": "#131315",
    "--elevated-bg": "#0e0e10",
    "--border": "rgba(255,255,255,0.07)",
    "--border-strong": "rgba(255,255,255,0.15)",
    "--text-primary": "#ffffff",
    "--text-secondary": "#d4d4d8",
    "--text-muted": "#a3a3a3",
    "--text-faint": "#71717a",
    "--hover-bg": "rgba(255,255,255,0.05)",
    "--track-bg": "rgba(255,255,255,0.10)",
    "--accent-soft-bg": "rgba(127,29,29,0.35)",
    "--accent-soft-border": "rgba(127,29,29,0.65)",
    "--ok-border": "#15803d",
    "--ok-bg": "rgba(20,83,45,0.4)",
    "--ok-text": "#4ade80",
    "--danger-border": "#b91c1c",
    "--danger-bg": "rgba(127,29,29,0.4)",
    "--danger-text": "#f87171",
    "--scrollbar": "#2a2a2d",
  },
  light: {
    "--bg": "#f4f4f6",
    "--sidebar-bg": "#ffffff",
    "--card-bg": "#ffffff",
    "--elevated-bg": "#f7f7f9",
    "--border": "rgba(0,0,0,0.08)",
    "--border-strong": "rgba(0,0,0,0.15)",
    "--text-primary": "#18181b",
    "--text-secondary": "#3f3f46",
    "--text-muted": "#6b6b72",
    "--text-faint": "#8b8b92",
    "--hover-bg": "rgba(0,0,0,0.04)",
    "--track-bg": "rgba(0,0,0,0.08)",
    "--accent-soft-bg": "rgba(254,226,226,0.9)",
    "--accent-soft-border": "rgba(248,113,113,0.6)",
    "--ok-border": "#16a34a",
    "--ok-bg": "rgba(220,252,231,0.9)",
    "--ok-text": "#15803d",
    "--danger-border": "#dc2626",
    "--danger-bg": "rgba(254,226,226,0.9)",
    "--danger-text": "#b91c1c",
    "--scrollbar": "#d4d4d8",
  },
};

const ThemeContext = React.createContext({ theme: "dark", toggleTheme: () => {} });
function useTheme() { return React.useContext(ThemeContext); }

async function loadTheme() {
  try {
    const r = await window.storage.get("taxelea:theme", false);
    return r ? r.value : "dark";
  } catch (e) { return "dark"; }
}
async function saveTheme(t) {
  try { await window.storage.set("taxelea:theme", t, false); } catch (e) {}
}


   (folder counts + real embedded practice questions)
   ============================================================ */
const EMBEDDED_TESTS = {"percentage": {"subject": "quantitative-aptitude", "topic": "Percentage", "title": "CGL Tier II CT 11: Percentage - 02", "provider": "Testbook", "duration": null, "questions": [{"q": "The expenditure and income of Rajeev are in the ratio of 5:8. After some time income of Rajeev is increased by 20% but at the same time, his saving also increased by 3 1/3 %. Find increased or decreased per cent in his expenditure.", "options": [{"id": "A", "text": "20%"}, {"id": "B", "text": "33.33%"}, {"id": "C", "text": "30%"}, {"id": "D", "text": "40%"}], "answer": "C", "solution": "Shortcut Trick Let initial Income = 800, Expenditure = 500 ⇒ Savings = 300 New Income = 800 + 20% = 960 New Savings = 300 + (10/3)% = 300 + 10 = 310 New Expenditure = 960 − 310 = 650 Increase in Expenditure = [(650 − 500) ÷ 500] × 100 = 30% ∴ The correct answer is 30%. Alternate Method Given: Ratio of Expenditure to Income = 5 : 8 Increase in Incom"}, {"q": "In a medium-size township, the trend of annual immigration is an addition of 20% of the population as it was at the beginning; also 15% of the population as it was at the beginning is estimated to relocate elsewhere\" every year. If the current population is 80000, what is the likely population three years hence?", "options": [{"id": "A", "text": "90000"}, {"id": "B", "text": "91200"}, {"id": "C", "text": "92000"}, {"id": "D", "text": "92610"}], "answer": "D", "solution": "Given: The current population of medium-sized town = 80000 Calculation: Net increase in immigration = 20% Net decrease because of relocation = 15% Net increase in population in a year = 20 - 15 = 5% The total increase in population in three years = ⇒ 80000 × ({105}{100})^3 ⇒ 80000 × ({21}{20})^3 ⇒ 80000 × {9261}{8000} ⇒ 92610 ∴The answer is 92610."}, {"q": "A number is increased by 10% and then reduced by 10%. If the resultant number is 99, the original number was:", "options": [{"id": "A", "text": "98"}, {"id": "B", "text": "100"}, {"id": "C", "text": "95"}, {"id": "D", "text": "110"}], "answer": "B", "solution": "Shortcut Trick Net percentage change = x + y + (xy / 100)% Here, x = +10% and y = −10%. Net change = 10 − 10 + (10 × −10 / 100) = −1% ( decrease ). So, 99% of the original number = 99. 100% of the original number = 100. ∴ The correct answer is 100. Alternate Method Given: Percentage increase = 10% Percentage reduction = 10% Resultant number = 99 Fo"}, {"q": "The population of a city increases at a rate of 2% for the first 2 years and then, decreases at a rate of 4% for the third year. What will be the population after 3 years if the present population of the city is 62,500?", "options": [{"id": "A", "text": "62424"}, {"id": "B", "text": "62400"}, {"id": "C", "text": "63500"}, {"id": "D", "text": "65424"}], "answer": "A", "solution": "Given Current population = 62,500 Increase rate for first 2 years = 2% Decrease rate for the third year = 4% Concept: Population after 'n' years = Initial Population × (1 + rate/100) n Solution: ⇒ After 2 years, Population = 62500 × (1 + 2/100) 2 = 65025 ⇒ After 3rd year, Population = 65025 × (1 - 4/100) = 62424 Therefore, the population after 3 ye"}, {"q": "If the price of onion increases from Rs. 60/kg to Rs. 75/kg, then by what percentage a household should decrease the consumption of onion so that expenditure remains same?", "options": [{"id": "A", "text": "25 percent"}, {"id": "B", "text": "20 percent"}, {"id": "C", "text": "30 percent"}, {"id": "D", "text": "40 percent"}], "answer": "B", "solution": "Let the household consume a kg of onion earlier and b kgs later. The amount paid by the household earlier and later be Rs.60a and Rs.75b Since both prices should be the same ⇒ 60a = 75b ⇒ b = 4a/5 Required percent = (a - 4a/5)/a × 100 = 20"}, {"q": "Admissions into a commerce course of a university increase by 5% every year. If the number of admissions presently is 2400 into that course, after three years, the number of admissions is Nearest to an integer:", "options": [{"id": "A", "text": "2778"}, {"id": "B", "text": "2770"}, {"id": "C", "text": "2775"}, {"id": "D", "text": "2780"}], "answer": "A", "solution": "Given: Principal amount = 2400 Rate = 5% per annum Time = 3 years Formula used: Amount = P (1+R/100) Time Calculations: Amount = P (1+R/100) Time = 2400 (1+5/100) 3 = 2400 (21/20) 3 = 2400 × 9261/8000 = 2778.3 ≈ 2778 Hence, Number of admission after 3 year is nearest to 2778."}, {"q": "Shubham secured 345 marks out of 600 in the annual examination. Find the percentage of marks obtained by him in the examination.", "options": [{"id": "A", "text": "57.5"}, {"id": "B", "text": "57.25"}, {"id": "C", "text": "58.5"}, {"id": "D", "text": "58.25"}], "answer": "A", "solution": "The percentage of marks obtained by him in the examination = (345/600 × 100) ⇒ (345/6) ⇒ 57.5%"}, {"q": "A fruit fermenter has a certain number of pineapples of which 15% are rotten. He sells 80% of the remaining and has 510 pineapples left. How many pineapples did he have initially?", "options": [{"id": "A", "text": "3600"}, {"id": "B", "text": "3000"}, {"id": "C", "text": "5000"}, {"id": "D", "text": "7000"}], "answer": "B", "solution": "Solution: Let initial number of Pineapple be x. ⇒ 15% are rotten. Fresh Pineapple = x - 15% of x = 0.85x ⇒ 80% of the fresh Pineapple he sold, ⇒ He has 20% of the fresh Pineapple remaining i.e., 510 (given) ⇒ 20/100 × 0.85x = 510 ⇒ 1/5 × 0.85x = 510 ⇒ 0.17x = 510 ⇒ x = 510 × 100/17 = 30 × 100 = 3000 Hence, there are initially 3000 Pineapples."}, {"q": "Sushil’s income is 22% less than Abhishek’s income. Abhishek’s income is what % more than Sushil’s income?", "options": [{"id": "A", "text": "27.8%"}, {"id": "B", "text": "28.20%"}, {"id": "C", "text": "30.8%"}, {"id": "D", "text": "25.8%"}], "answer": "B", "solution": "Given: Sushil's income is 22% less than Abhishek's income. Formula Used: Percentage increase = (Difference / Original) × 100 Calculation: Let Abhishek's income be A . Sushil's income = A - 0.22A = 0.78A Difference in income = A - 0.78A = 0.22A Percentage increase = (0.22A / 0.78A) × 100 Percentage increase = (0.22 / 0.78) × 100 Percentage increase "}, {"q": "If an error of 2% is made in measures the side of a square, what will be the percentage error in area?", "options": [{"id": "A", "text": "2%"}, {"id": "B", "text": "4%"}, {"id": "C", "text": "2.2%"}, {"id": "D", "text": "4.04%"}], "answer": "D", "solution": "Concept use: Area of Square = side 2 Calculation: Let's say we have a square with a true side length of 100 units The original area of this square would be 100 units × 100 units = 10,000 square units. Now, a 2% error in measuring the side of the square. This means our measured side length would be 100 units + 2% of 100 units = 102 units. The area o"}]}, "time-work": {"subject": "quantitative-aptitude", "topic": "Time & Work", "title": "CBT Exam - pundits", "provider": "Pundits", "duration": 20, "questions": [{"q": "In an office, 75 employees can finish a project in 60 days. After few days, 15 employees left the job and the project was completed in 65 days. After how many days did the 15 employees leave? एक कार्यालय में , 75 कर्मचारी एक परियोजना को 60 दिनों में पूरा कर सकते हैं। कुछ दिनों के बाद , 15 कर्मचारियों ने नौकरी छोड़ दी और परियोजना 65 दिनों में पूरी हो गई। 15 कर्मचारियों ने कितने दिनों के बाद नौकरी छोड़ दी ?", "options": [{"id": "A", "text": "50 50"}, {"id": "B", "text": "45 45"}, {"id": "C", "text": "30 30"}, {"id": "D", "text": "40 40"}], "answer": "D", "solution": "Let the required number of days = x 75 × 60 = 75x + 60 × [65 - x] 4500 = 3900 + 75x - 60x 600 = 75x - 60x 600 = 15x; i.e. x=40 मान लीजिए आवश्यक दिनों की संख्या = x 75 × 60 = 75x + 60 × [65 - x] 4500 = 3900 + 75x - 60x 600 = 75x - 60x 600 = 15x; यानी x=40"}, {"q": "A can finish a piece of work in a certain number of days. B takes 45% more number of days, to finish the same work independently. They worked together for 58 day and then the remaining work was done by B alone in 29 days. In how many days could A have completed the work, had he worked alone? A किसी काम को कुछ दिनों में पूरा कर सकता है। B को उसी काम को स्वतंत्र रूप से पूरा करने में 45% अधिक दिन लगते हैं। उन्होंने 58 दिनों तक एक साथ काम किया और फिर शेष काम B ने अकेले 29 दिनों में पूरा किया। यदि A ने अकेले काम किया होता , तो वह काम कितने दिनों में पूरा कर सकता था ?", "options": [{"id": "A", "text": "110 days 110 दिन"}, {"id": "B", "text": "118 days 118 दिन"}, {"id": "C", "text": "98 days 98 दिन"}, {"id": "D", "text": "120 days 120 दिन"}], "answer": "B", "solution": "Ratio of time taken by A and B = 100 : 145=20:29 Then, Ratio of efficiency = 29 : 20 In 58 days work done by A & B ≔58 × 49 = 2842 Remaining work by B = 20 × 29 = 580 Total work =2842 + 580 = 3422 Time taken by A= =118 days A और B द्वारा लिए गए समय का अनुपात = 100 : 145 = 20:29 फिर , दक्षता का अनुपात = 29 : 20 58 दिनों में A और B द्वारा किया गया का"}, {"q": "A, B and C individually can complete a work in x, 30 and 45 days, respectively. B and C worked together for 6 days. The remaining work was completed by A alone in 12 days. The value of x is: A, B और C अकेले एक काम को क्रमशः x, 30 और 45 दिनों में पूरा कर सकते हैं। B और C ने मिलकर 6 दिन काम किया। शेष काम A ने अकेले 12 दिनों में पूरा किया। x का मान है:", "options": [{"id": "A", "text": "18 days 18 दिन"}, {"id": "B", "text": "20 days 20 दिन"}, {"id": "C", "text": "24 days 24 दिन"}, {"id": "D", "text": "15 days 15 दिन"}], "answer": "A", "solution": "Efficiency of A, B and C are 90/x, 3, 2 = [B + C] 6 +12[A] = 90 =5 × 6 +12[A] =30 + 12[A] = 90 A = 5 Means x = =18 days A, B और C की दक्षता 90/x, 3, 2 है = [B + C] 6 +12[A] = 90 =5 × 6 +12[A] =30 + 12[A] = 90 A = 5 मतलब x = =18 दिन"}, {"q": "P alone can complete a piece of work in 10 days while Q alone can complete the same piece of work in 15 days. To complete the work in 4 days, R is hired by P and Q. How many days does R take to complete the work alone? P अकेले एक काम को 10 दिनों में पूरा कर सकता है जबकि Q अकेले उसी काम को 15 दिनों में पूरा कर सकता है। काम को 4 दिनों में पूरा करने के लिए , P और Q ने R को काम पर रखा है। R को अकेले काम पूरा करने में कितने दिन लगते हैं ?", "options": [{"id": "A", "text": "6 days 6 दिन"}, {"id": "B", "text": "8 days 8 दिन"}, {"id": "C", "text": "9 days 9 दिन"}, {"id": "D", "text": "12 days 12 दिन"}], "answer": "D", "solution": "Let efficiency of R = R Work should be completed in 4 days = 30 ⇒ 4[5 + R] R =2.5 Then R completes the whole work = =12 days माना R की दक्षता = R कार्य 4 दिन में पूरा होना चाहिए = 30 ⇒ 4[5 + R] R =2.5 तो R पूरा कार्य पूरा कर लेता है = =12 दिन"}, {"q": "A certain number of persons can complete a piece of work in 46 days. If there were 8 persons more, the work could be finished in 16 days less. How many persons were originally there? कुछ निश्चित व्यक्ति किसी काम को 46 दिन में पूरा कर सकते हैं। यदि 8 व्यक्ति और होते , तो काम 16 दिन कम में पूरा हो सकता था। मूल रूप से कितने व्यक्ति थे ?", "options": [{"id": "A", "text": "25 25"}, {"id": "B", "text": "18 18"}, {"id": "C", "text": "15 15"}, {"id": "D", "text": "20 20"}], "answer": "C", "solution": "let no. of people =x x × 46 =[x + 8] 30 46x = 30x + 240 16x =240 x =15 माना लोगों की संख्या = x x × 46 =[x + 8] 30 46x = 30x + 240 16x =240 x =15"}, {"q": "In a press, there are three types of printing machines, P, Q and R. Machine P can print 10,000 pages in 8 hours, machine Q can finish the same task in 10 hours and machine R can finish the same task in 15 hours. All the three machines start the work at 9:00 a.m. Machine P breaks down at 11:00.a.m and machines Q and R finish the task. The approximate time of completion of the job is: एक प्रेस में तीन प्रकार की प्रिंटिंग मशीनें हैं , P, Q और R. मशीन P 8 घंटे में 10,000 पेज प्रिंट कर सकती है , मशीन Q उसी काम को 10 घंटे में पूरा कर सकती है और मशीन R उसी काम को 15 घंटे में पूरा कर सकती है . तीनों मशीनें सुबह 9:00 बजे काम शुरू करती हैं . मशीन P सुबह 11:00 बजे खराब हो जाती है और मशीन Q और R काम पूरा कर देती हैं . काम पूरा होने में लगने वाला अनुमानित समय है :", "options": [{"id": "A", "text": "2:05 p.m 2:05 p.m"}, {"id": "B", "text": "1:30 p.m 1:30 p.m"}, {"id": "C", "text": "2:30 p.m 2:30 p.m"}, {"id": "D", "text": "1:50 p.m 1:50 p.m"}], "answer": "B", "solution": "Efficiency of Machine P : Q : R = Lcm of 8, 10, 15 = 120 P= =15 Q= =12 R= =8 Efficiency of all together = 15 + 12 + 8 = 35 In 2 hours work done = 35 × 2 = 70 Work left =120 70 = 50 Completed by Q & R= =2.5 hours Total time taken =11:00 to 2.5 hours =1:30pm मशीन P : Q : R की दक्षता = 8, 10, 15 का Lcm = 120 P= =15 Q= =12 R= =8 सभी की एक साथ दक्षता = "}, {"q": "The marks scored by a student are directly proportional to the time invested in studies. If the student gets 60 marks when he studies 4 hours a day, then how many hours he should use in his studies daily to get 75 marks? एक छात्र द्वारा प्राप्त अंक सीधे तौर पर पढ़ाई में लगाए गए समय के समानुपाती होते हैं। यदि छात्र प्रतिदिन 4 घंटे पढ़ाई करके 60 अंक प्राप्त करता है , तो उसे 75 अंक प्राप्त करने के लिए प्रतिदिन अपनी पढ़ाई में कितने घंटे लगाने चाहिए ?", "options": [{"id": "A", "text": "4.5 4.5"}, {"id": "B", "text": "6 6"}, {"id": "C", "text": "5 5"}, {"id": "D", "text": "5.5 5.5"}], "answer": "C", "solution": "Marks ∝ time Marks = k × time 60 = k × 4 k = 15 ⇒ 75 =15 × time Time =5 hours अंक ∝ समय अंक = k × समय 60 = k × 4 k = 15 ⇒ 75 =15 × समय समय = 5 घंटे"}, {"q": "A certain number of person can complete a work in 34 days working 9 hours a day. If the number of persons is decreased by 40% then how many hours a day should the remaining persons work to complete the work in 51 days? कुछ व्यक्ति प्रतिदिन 9 घंटे काम करके 34 दिनों में एक काम पूरा कर सकते हैं। यदि व्यक्तियों की संख्या 40% कम हो जाती है , तो शेष व्यक्तियों को 51 दिनों में काम पूरा करने के लिए प्रतिदिन कितने घंटे काम करना चाहिए ?", "options": [{"id": "A", "text": "8 8"}, {"id": "B", "text": "10 10"}, {"id": "C", "text": "9 9"}, {"id": "D", "text": "12 12"}], "answer": "B", "solution": "Let No. of persons be 100x and No. of hours = y = 34 × 100x × 9= 60x × 51 × y y = 10 days माना व्यक्तियों की संख्या 100x है तथा घंटों की संख्या = y = 34 × 100x × 9= 60x × 51 × y y = 10 दिन"}, {"q": "A certain number of men can complete a piece of work in 6k days, where k is a natural number. By what percentage should the number of men be increased so that the work can be completed in 5k days? कुछ निश्चित संख्या में पुरुष किसी कार्य को 6k दिनों में पूरा कर सकते हैं , जहाँ k एक प्राकृतिक संख्या है। पुरुषों की संख्या में कितने प्रतिशत की वृद्धि की जानी चाहिए ताकि कार्य 5k दिनों में पूरा हो सके ?", "options": [{"id": "A", "text": "10% 10%"}, {"id": "B", "text": ""}, {"id": "C", "text": "20% 20%"}, {"id": "D", "text": "25% 25%"}], "answer": "C", "solution": "[5K × M] : [6K × M]= 5 ∶ 6 So, the number of persons increased by = ×100 = 20% [5K × M] : [6K × M]= 5 ∶ 6 इसलिए , व्यक्तियों की संख्या में वृद्धि = ×100 = 20%"}, {"q": "A work was finished by Amit, Sumit and Vinit together. Amit and Sumit together finished 70% part of the work and Sumit and Vinit together finished 50% part of the work. Who among the three is the most efficient? एक काम अमित , सुमित और विनीत ने मिलकर पूरा किया। अमित और सुमित ने मिलकर काम का 70% हिस्सा पूरा किया और सुमित और विनीत ने मिलकर काम का 50% हिस्सा पूरा किया। तीनों में से कौन सबसे कुशल है ?", "options": [{"id": "A", "text": "All are equal सभी बराबर हैं"}, {"id": "B", "text": "Vinit विनीत"}, {"id": "C", "text": "Amit अमित"}, {"id": "D", "text": "Sumit सुमित"}], "answer": "C", "solution": "Amit + Sumit =70% Vinit = 30% Sumit + Vinit = 50% So, Work done by Amit = 50%, Vinit = 30% and Sumit = 20% Therefore, most efficient is Amit अमित + सुमित = 70% विनित = 30% सुमित + विनीत = 50% अतः , अमित द्वारा किया गया कार्य = 50%, विनीत = 30% तथा सुमित = 20% अतः , सबसे कुशल अमित है"}, {"q": "A can complete a certain work in 30 days. B is 20% more efficient than A. C can complete part of the same work in 8 days. A and B together complete part of the work. The remaining work remaining work is completed by A and C together. In how many days was the entire work completed? A किसी काम को 30 दिन में पूरा कर सकता है। B, A से 20% अधिक दक्ष है। C उसी काम का भाग 8 दिन में पूरा कर सकता है। A और B मिलकर काम का भाग पूरा करते हैं। शेष काम A और C मिलकर पूरा करते हैं। पूरा काम कितने दिन में पूरा हुआ ?", "options": [{"id": "A", "text": ""}, {"id": "B", "text": "14 14"}, {"id": "C", "text": ""}, {"id": "D", "text": "13 13"}], "answer": "C", "solution": "Efficiency = A : B = 5 : 6 Time = A : B = 6 : 5 A = 30 days then B = × 5 = 25 days Total work = 30 × 5 =150 Efficiency of C = × =7.5 A+B have completed 11/15 of work, so work left =150 × = 40 Time taken by A + B together = =10 days Time taken by A + C together = = days Therefore, the entire work complete in = 10 days + days = days कार्यदक्षता = A :"}, {"q": "P can do one-fourth piece of some work in 18 days. She completed 37.5% of that work and left it. Q completed the remaining work in 40 days. Working together they will complete part of the same work in: P किसी काम का एक - चौथाई हिस्सा 18 दिनों में पूरा कर सकती है। उसने उस काम का 37.5% पूरा किया और उसे छोड़ दिया। Q ने शेष काम 40 दिनों में पूरा किया। साथ मिलकर काम करते हुए वे उसी काम का हिस्सा कितने दिनों में पूरा करेंगे :", "options": [{"id": "A", "text": "6 days 6 दिन"}, {"id": "B", "text": "10 days 10 दिन"}, {"id": "C", "text": "12 days 12 दिन"}, {"id": "D", "text": "8 days 8 दिन"}], "answer": "C", "solution": "P→ →18 = 72 days Now 37.5% work has done 62.5% left and will be completed by Q in 40 days Q can complete all work in = ×100 = 64 days Let Total work =LCM of 64 & 72 = 576 Efficiency of P = =8 and efficiency of Q = = 9 Therefore the required time = = 12 days P → → 18 = 72 दिन अब 37.5% काम हो चुका है , 62.5% काम बाकी है और Q इसे 40 दिनों में पूरा करे"}, {"q": "There are three taps of diameter 2 cm, 3 cm and 4 cm, respectively. The ratio of the water flowing through them is equal to the ratio of the square of their diameters. The biggest tap can fill an empty tank alone in 81 min. If all the taps are opened simultaneously, then how long will the tank take [in min] to be filled? तीन नल हैं जिनका व्यास क्रमशः 2 सेमी , 3 सेमी और 4 सेमी है। उनके माध्यम से बहने वाले पानी का अनुपात उनके व्यास के वर्ग के अनुपात के बराबर है। सबसे बड़ा नल अकेले एक खाली टैंक को 81 मिनट में भर सकता है। यदि सभी नल एक साथ खोल दिए जाएँ , तो टैंक को भरने में [ मिनटों में ] कितना समय लगेगा ?", "options": [{"id": "A", "text": ""}, {"id": "B", "text": ""}, {"id": "C", "text": ""}, {"id": "D", "text": ""}], "answer": "D", "solution": "According to Question: Diameter: - 2 : 3 : 4 Water Flow: - 4 : 9 : 16 Capacity = Efficiency Time =16 × 81 = 1296 Required Time = = = minutes प्रश्न के अनुसार : व्यास : - 2 : 3 : 4 जल प्रवाह : - 4 : 9 : 16 क्षमता = दक्षता × समय =16 × 81 = 1296 आवश्यक समय = = = मिनट"}, {"q": "Two pipes can fill a tank separately in 36 minutes and 45 minutes respectively. An exhaust pipe fitted in the tank can remove 40 Litres of water per minute. If all three pipes are opened together, the tank is filled in one hour. Find the capacity [in litres] of the tank. दो पाइप एक टैंक को अलग - अलग क्रमशः 36 मिनट और 45 मिनट में भर सकते हैं। टैंक में लगा एक निकास पाइप प्रति मिनट 40 लीटर पानी निकाल सकता है। यदि तीनों पाइप एक साथ खोले जाते हैं , तो टैंक एक घंटे में भर जाता है। टैंक की क्षमता [ लीटर में ] ज्ञात कीजिए।", "options": [{"id": "A", "text": "600 600"}, {"id": "B", "text": "400 400"}, {"id": "C", "text": "300 300"}, {"id": "D", "text": "1200 1200"}], "answer": "D", "solution": "If all Pipes are opened together ⇒ [5 + 4 - C] × 60 = 180 ⇒ C = 40 L/min ⇒ Capacity of tank =180 × =1200 litres यदि सभी पाइप एक साथ खोले जाएं ⇒ [5 + 4 - C] × 60 = 180 ⇒ C = 40 L/min ⇒ टैंक की क्षमता = 180 × =1200 लीटर"}, {"q": "A cistern can be filled by one of two pipes in 52 minutes and by the other pipe in 60 minutes. Both pipes are opened together for a certain time but being particularly clogged only of the full quantity of water flows through the first pipe and only of the full quantity of water flows through the second pipe. The obstructions, however, were suddenly removed in both the pipes after sometime and the cistern got filled in 15 minutes from that moment. For how many minutes did the pipes remain clogged? एक टंकी को दो पाइपों में से एक द्वारा 52 मिनट में तथा दूसरे पाइप द्वारा 60 मिनट में भरा जा सकता है। दोनों पाइपों को एक निश्चित समय के लिए एक साथ खोला जाता है , लेकिन विशेष रूप से अवरुद्ध होने के कारण पहले पाइप से केवल पानी बहता है तथा दूसरे पाइप से केवल 3/4 पानी बहता है। हालाँकि , कुछ समय बाद दोनों पाइपों में अवरोध अचानक हटा दिए गए तथा उस क्षण से 15 मिनट में टंकी भर गई। कितने मिनट तक पाइप अवरुद्ध रहे ?", "options": [{"id": "A", "text": ""}, {"id": "B", "text": ""}, {"id": "C", "text": ""}, {"id": "D", "text": ""}], "answer": "A", "solution": "According to question: × t + × 28 = 52 × 15 × t + × 28 = 52 × 15 ⇒ × t + × 28 = 52 × 15 ⇒ × t = ⇒ t = = Minutes प्रश्न के अनुसार : × t + × 28 = 52 × 15 × t + × 28 = 52 × 15 ⇒ × t + × 28 = 52 × 15 ⇒ × t = ⇒ t = = मिनट"}]}, "syllogism": {"subject": "reasoning", "topic": "Syllogism", "title": "CGL Tier II CT 16: Syllogism - 01", "provider": "Testbook", "duration": null, "questions": [{"q": "Given below are three statements followed by two conclusions । and II. You have to consider the statements to be true even if they seem to be at variance from commonly known facts. Decide which of the conclusions follow from the statements. Statements: 1. No guitar is a violin. 2. All violins are strings 3. No string is metal. Conclusion: I. No string being violin is a possibility. II. Some guitars are not strings.", "options": [{"id": "A", "text": "Both conclusion I and II follow."}, {"id": "B", "text": "Neither I nor II f ollows"}, {"id": "C", "text": "Only conclusion I follows."}, {"id": "D", "text": "Only conclusion II follows."}], "answer": "B", "solution": "The least possible Venn diagram is as follows: Conclusion: I. No string being violin is a possibility. → False ( All violins are strings, so it is not possible.) II. Some guitars are not strings. → False (There is no direct negative relation between Guitar and String, So it doesn't follow.) (Given Venn diagram follows all the statements. From the d"}, {"q": "Read the given statements and conclusions carefully. Assuming that the information given in the statements is true, even if it appears to be at variance with commonly known facts, decide which of the given conclusions logically follow(s) from the statements. Statements : All flags are symbols. All symbols are prides. Some prides are bright. Conclusions : (I) All flags are prides. (II) Some flags are bright is a possibility. (III) Some symbols are bright is a possibility.", "options": [{"id": "A", "text": "Only conclusion I follows"}, {"id": "B", "text": "Only conclusion II follows"}, {"id": "C", "text": "All conclusions I, II and III follow"}, {"id": "D", "text": "Both conclusions I and II follow"}], "answer": "C", "solution": "Statements : (I) All flags are symbols, (II) All symbols are prides and (III) Some prides are bright. The Venn diagram as per the given statements: Conclusions : (I) All flags are prides. → Follow (Because all flags are symbols and all symbols are pride so that all flags are pride is definitely true) (II) Some flags are bright is a possibility. → F"}, {"q": "The statements below are followed by two conclusions labeled I and II. Assuming that the information in the statements is true, even if it appears at variance with generally established facts, decide which conclusion(s) logically and definitely follow(s) from the information given in the Statements: All knights are nuns. All nuns are men. Conclusion: I. All men are knights. II. All knights are men.", "options": [{"id": "A", "text": "Either conclusion I or conclusion II follows."}, {"id": "B", "text": "Both conclusions follow."}, {"id": "C", "text": "Only conclusion II follows."}, {"id": "D", "text": "Only conclusion I follows."}], "answer": "C", "solution": "Conclusion I: All men are knights → False (This is definitely false) Conclusion II: All knights are men → True (This is definitely true)"}, {"q": "Three Statements are given followed by two conclusions numbered I and II. Assuming the statements to be true, even if they seem to be at variance with commonly known facts, decide which of the conclusions logically follow(s) from the statements. Statement I: No bridge is a mountain. Statement II: Some mountains are monuments. Statement III: All monuments are harbours. Conclusion I: Some harbours are mountains. Conclusion II: No bridge is a monument.", "options": [{"id": "A", "text": "Neither conclusion I nor II follows"}, {"id": "B", "text": "Only conclusion II follows"}, {"id": "C", "text": "Both conclusions I and II follow"}, {"id": "D", "text": "Only conclusion I follows"}], "answer": "D", "solution": "Conclusions: I. Some harbours are mountains → F ollow (As some mountains are monuments and all monuments are harbours. As whole monuments comes in harbours and has some part common with mountains, therefore it is true.) II. No bridge is a monument → Does not f ollow (As no bridge is a mountain and some mountains are monuments. As no direct relation"}, {"q": "Directions: In the question below are given two statements followed by two conclusions I and II. You have to take the given statements to be true even if they seem to be at variance with commonly known facts. Read all the conclusions and then decide which of the given conclusion logically follows from the given statements disregarding commonly known facts Statements: Some bed are table No table is lamp Conclusions: I. All lamp is bed II. Some bed are not lamp", "options": [{"id": "A", "text": "Only I follows"}, {"id": "B", "text": "Only II follows"}, {"id": "C", "text": "Either I or II follows"}, {"id": "D", "text": "Neither I nor II follows"}], "answer": "B", "solution": "The least possible Venn diagram is as follows Conclusions: I. All lamp is bed → False (as there is no direct relation given between lamp and bed) II. Some bed are not lamp → True (as some bed are table and no table is lamp → that portion of bed which is included in table will definitely not be lamp. the lined portion will definitely not be lamp) He"}, {"q": "In the question below, there are three statements followed by two conclusions. You have to take the given statements to be true even if they seem to be at variance with commonly known facts and then decide which of the given conclusion logically follow(s) from the given statements. Statements: 1. All keys are locks. 2. All locks are screws. 3. All doors are keys. Conclusions: I. All screws are keys. II. Some locks are keys.", "options": [{"id": "A", "text": "If only conclusion I follows"}, {"id": "B", "text": "If neither conclusion I nor II follows"}, {"id": "C", "text": "If either conclusion I or II follows"}, {"id": "D", "text": "If only conclusion II follows"}], "answer": "D", "solution": "The least possible Venn diagram for the given statements is as below: Conclusions: (1) All screws are keys → False → (All keys are screws but vise-versa is NOT true). (2) Some locks are keys → True → (As all he keys are locks thus some lock will be keys is a definite statements). Hence, Option (4) is correct. Additional Information Suppose for an E"}, {"q": "Two Statements are given followed by two conclusions numbered I and II. Assuming the statements to be true, even if they seem to be at variance with commonly known facts, decide which of the conclusions logically follow(s) from the statements. Statements: All bottles are black. Some black are white. Conclusions: I. All blacks are bottles. II. Some blacks are not white.", "options": [{"id": "A", "text": "Both conclusions I and II follow"}, {"id": "B", "text": "Only conclusion II follows"}, {"id": "C", "text": "Neither conclusion I nor II follows"}, {"id": "D", "text": "Only conclusion I follows"}], "answer": "C", "solution": "Given Statements: All bottles are black. Some black are white. The least possible Venn diagram for the given statement is: Conclusions: I. All blacks are bottles - False (Because, some black are bottles, and all blacks are bottles can be possible only ). II. Some blacks are not white - False (Because, some black are white, but no information given "}, {"q": "Three Statements are given followed by two conclusions numbered I and II. Assuming the statements to be true, even if they seem to be at variance with commonly known facts, decide which of the conclusions logically follow(s) from the statements. Statement I: Some books are pens. Statement II: All pens are pencils. Statement III: No pencil is a marker. Conclusion I: Some books are not pens. Conclusion II: No pen is a marker.", "options": [{"id": "A", "text": "Only conclusion I follows"}, {"id": "B", "text": "Only conclusion II follows"}, {"id": "C", "text": "Neither conclusion I nor II follows"}, {"id": "D", "text": "Both conclusions I and II follow"}], "answer": "B", "solution": "The least possible Venn diagram is: Conclusion: I: Some books are not pens. - False (Because, Some books are pens given, so some books are not pens it is not possible) II: No pen is a marker. - True (Because, All pens are pencils and No pencil is a marker so No pen is a marker it is definite)"}, {"q": "Given below both the statements are given followed by two conclusions numbered I and II. You have to consider the statements to be true even if they seem to be at variance from commonly known facts. Decide which of the conclusions follow from the statements. Statements: 1. Some peons are soldiers. 2. Some soldiers are not cooks. Conclusion: I. Some soldiers are peons. II. Some cooks are soldiers.", "options": [{"id": "A", "text": "Only conclusion I follows."}, {"id": "B", "text": "Both conclusions I and II follow."}, {"id": "C", "text": "Neither conclusion I nor II follows."}, {"id": "D", "text": "Only conclusion II follows."}], "answer": "A", "solution": "The least possible Venn diagram is given below:- Conclusion: I. Some soldiers are peons. → True ( Some peons are soldiers. So, we can say that some soldiers are peons.) II. Some cooks are soldiers. → False ( it is possible but not definite) Hence, \"option 1\" is the correct answer."}, {"q": "In this question, three statements are given, followed by two conclusions numbered I and II. Assuming the statements to be true, even if they seem to be at variance with commonly known facts, decide which of the conclusions logically follows/follow from the statements. Statements: All notebooks are pink. All pinks are shirts. Some shirts are trousers. Conclusions: I. All trousers are notebooks. II. Some trousers are pink.", "options": [{"id": "A", "text": "Only conclusion I follows."}, {"id": "B", "text": "Both conclusions I and II follow."}, {"id": "C", "text": "Neither conclusion I nor II follows."}, {"id": "D", "text": "Only conclusion II follows."}], "answer": "C", "solution": "I. All trousers are notebooks - False (No definite relation given between trousers and notebooks , so it can be possible only). II. Some trousers are pink - False ( No definite relation given between trousers and pink , so it can be possible only )."}]}, "analogy": {"subject": "reasoning", "topic": "Analogy", "title": "CGL Tier II CT 03: Symbolic/ Number Analogy", "provider": "Testbook", "duration": null, "questions": [{"q": "Select the option that is related to the sixth number in the same way as the first number is related to the second number and the third number is related to the fourth number. 11 : 81 :: 22 : 400 :: ? : 225", "options": [{"id": "A", "text": "11"}, {"id": "B", "text": "13"}, {"id": "C", "text": "17"}, {"id": "D", "text": "15"}], "answer": "C", "solution": "The logic followed here is: Logic: (1st number - 2) 2 = 2nd number . Now, 11 : 81 → (11 - 2) 2 ⇒ 9 2 = 81. 22 : 400 → (22 - 2) 2 ⇒ 20 2 = 400. Similarly, for ? : 225 → (17 - 2) 2 ⇒ 15 2 = 225. Hence, the correct answer is \"Option 3\" ."}, {"q": "Select the set in which the numbers are related in the same way as are the numbers of the following sets. (NOTE: Operations should be performed on the whole numbers, without breaking down the numbers into its constituent digits. E.g. 13- Operations on 13 such as adding /subtracting /multiplying etc. to 13 can be performed. Breaking down 13 into 1 and 3 and then performing mathematical operations on 1 and 3 is not allowed.) (7, 91, 98) (4, 52, 56)", "options": [{"id": "A", "text": "(12, 156, 168)"}, {"id": "B", "text": "(3, 36, 42)"}, {"id": "C", "text": "(8, 80, 96)"}, {"id": "D", "text": "(5, 25, 60)"}], "answer": "A", "solution": "Logic: Second Number = First Number × 13 , Third Number = First Number + Second Number Option 1) (12, 156, 168) → 156 = 12 × 13 → 168 = 12 + 156 ⇒ Satisfies the logic."}, {"q": "Select the option that is related to the third term in the same way as the second term is related to the first term and the sixth term is related to the fifth term. 42 ∶ 12 ∶∶ 77 ∶ ? ∶∶ 91 : 19", "options": [{"id": "A", "text": "15"}, {"id": "B", "text": "19"}, {"id": "C", "text": "17"}, {"id": "D", "text": "14"}], "answer": "C", "solution": "42 : 12 → (42 ÷ 7) + 6 = 6 + 6 = 12 91 : 19 → (91 ÷ 7) + 6 = 13 + 6 = 19 77 : ? → (77 ÷ 7) + 6 = 11 + 6 = 17"}, {"q": "Select the option that is related to the fifth term in the same way as the second term is related to the first term and fourth term related to third term. 7689 : 120 :: 6178 : 88 :: 3284 : ?", "options": [{"id": "A", "text": "68"}, {"id": "B", "text": "70"}, {"id": "C", "text": "69"}, {"id": "D", "text": "75"}], "answer": "A", "solution": "The pattern in the given series is: Logic: (Sum of all the digits of first term) × 4 = Second term Let's apply the pattern: 7689 : 120 :: 6178 : 88 :: 3284 : ? (Sum of all the digits of first term) × 4 = Second term (7 + 6 + 8 + 9) × 4 = 120 30 × 4 = 120 120 = 120 7689 : 120 :: 6178 : 88 :: 3284 : ? (Sum of all the digits of first term) × 4 = Secon"}, {"q": "Select the option that is related to the fourth term in the same way as the first term is related to the second term and the fifth term is related to the sixth term. 143 ∶ 11 ∶∶ ? ∶ 13 ∶∶ 437 ∶ 19", "options": [{"id": "A", "text": "309"}, {"id": "B", "text": "221"}, {"id": "C", "text": "272"}, {"id": "D", "text": "168"}], "answer": "B", "solution": "The logic followed is: Logic: First-term = Second term × Next prime number According to the above relation, the missing term will be as- Missing term = 13 × next prime number Missing term = 13 × 17 = 221 Hence, Option (2) is correct. Additional Information Some facts about the Prime numbers: A prime number is a natural number greater than 1 that is"}, {"q": "Select the set in which the numbers are related in the same way as are the numbers of the following set. (NOTE: Operations should be performed on the whole numbers, without breaking down the numbers into its constituent digits. E.g. 13 - Operations on 13 such as adding /subtracting/multiplying etc. to 13 can be performed. Breaking down 13 into 1 and 3 and then performing mathematical operations on 1 and 3 is NOT allowed) (264, 43, 19) (132, 27, 15)", "options": [{"id": "A", "text": "(331, 50, 29)"}, {"id": "B", "text": "(240, 59, 39)"}, {"id": "C", "text": "(176, 39, 23)"}, {"id": "D", "text": "(151, 63, 52)"}], "answer": "C", "solution": "Logic: (Second number - Third number) × 11 = First number (176, 39, 23) → (39 - 23) × 11 = 16 × 11 = 176 Hence, ' (176, 39, 23) ' is the correct answer."}, {"q": "Select the option that is related to the fifth number in the same way as the second number is related to the first number and fourth number is related to third number. 102 : 119 : : 78 : 91 : : 114 : ?", "options": [{"id": "A", "text": "133"}, {"id": "B", "text": "147"}, {"id": "C", "text": "182"}, {"id": "D", "text": "126"}], "answer": "A", "solution": "The pattern followed is : 17 × 6 = 102; 17 × 7 = 119; 13 × 6 = 78; 13 × 7 = 91; Similarly, 19 × 6 = 114; 19 × 7 = 133 Hence, ‘133’ is the correct answer."}, {"q": "From the given alternatives, select the option in which the set of numbers follows the same logic/rule/relationship as the numbers given below. (8, 33, 49)", "options": [{"id": "A", "text": "(17, 69, 103)"}, {"id": "B", "text": "(13, 52, 79)"}, {"id": "C", "text": "(7, 29, 42)"}, {"id": "D", "text": "(9, 38, 57)"}], "answer": "A", "solution": "Given set: (8, 33, 49) The logic followed here is, 1st number × 4 + 1 = 2nd number 1st number × 6 + 1 = 3rd number ⇒ 8 × 4 + 1 = 32 + 1 = 33 ⇒ 8 × 6 + 1 = 48 + 1 = 49 Now, checking the options: Option 1: (17, 69, 103) ⇒ 17 × 4 + 1 = 68 + 1 = 69 ⇒ 17 × 6 + 1 = 102 + 1 = 103 Option 2: (13, 52, 79) ⇒ 13 × 4 + 1 = 52 + 1 = 53 ≠ 2nd number ⇒ 13 × 6 + 1 "}, {"q": "Select the option that is related to the third number in the same way as the second number is related to the first number. 14 : 112 :: 18 : ?", "options": [{"id": "A", "text": "180"}, {"id": "B", "text": "181"}, {"id": "C", "text": "184"}, {"id": "D", "text": "183"}], "answer": "A", "solution": "The logic followed here is:- 1st number × ((1st number ÷ 2) + 1) = Second number. For 14 : 112 14 × ((14 ÷ 2) + 1) = 14 × (7 + 1) = 14 × 8 = 112 Similarly, For 18 : ? 18 × ((18 ÷ 2) + 1) = 18 × (9 + 1) = 18 × 10 = 180 Hence, \"option 1\" is the correct answer."}, {"q": "In the following question, select the related number from the given alternatives. 45 : 400 :: 64 : ?", "options": [{"id": "A", "text": "529"}, {"id": "B", "text": "484"}, {"id": "C", "text": "625"}, {"id": "D", "text": "576"}], "answer": "D", "solution": "The logic followed here is: 45 → 4 × 5 = 20 → 20 2 = 400 Similarly, 64 → 6 × 4 = 24 → 24 2 = 576 Hence, the correct answer is 576 ."}]}, "reading-comprehension": {"subject": "english", "topic": "Reading Comprehension", "title": "CT 28: Reading Comprehension - 02", "provider": "Testbook", "duration": null, "questions": [{"q": "What is the closest synonym for “paradigm” as used in the passage?", "options": [{"id": "A", "text": "Experiment"}, {"id": "B", "text": "Model"}, {"id": "C", "text": "Contradiction"}, {"id": "D", "text": "Problem"}], "answer": "B", "solution": "The correct answer is: Option 2) Model i.e. 'Model'. Key Points The word \"paradigm\" means a typical example or pattern of something; a model. (प्रतिमान) Example: The scientific method serves as a paradigm for rigorous experimentation. \"Model\" means a representative form or pattern. (मॉडल) Example: The architect used a scale model to demonstrate the"}, {"q": "What can be concluded about current thinking on obesity and diabetes?", "options": [{"id": "A", "text": "It is based on two main assumptions: that obesity causes diabetes, and that obesity is caused by an energy imbalance, but these may not be entirely correct."}, {"id": "B", "text": "It has successfully solved the obesity epidemic."}, {"id": "C", "text": "It ignores all previous research."}, {"id": "D", "text": "It only considers genetic factors."}], "answer": "A", "solution": "The correct answer is ' Option 1 '. Key Points A) The passage implies that the current assumptions regarding the causes of obesity and diabetes may be flawed and need to be reconsidered. It mentions that current paradigms focus on obesity causing diabetes and an energy imbalance causing obesity, but these views may not fully account for the situati"}, {"q": "According to the passage, what happened to the theory linking sugar to obesity and diabetes after the Second World War?", "options": [{"id": "A", "text": "It became the dominant paradigm."}, {"id": "B", "text": "It was dismissed and replaced by the focus on dietary fat."}, {"id": "C", "text": "It was proven to be false."}, {"id": "D", "text": "It was widely implemented in public health policies."}], "answer": "B", "solution": "The correct answer is ' Option 2 '. Key Points A) The passage explains that the German and Austrian clinical investigators' theory linking sugar to obesity and diabetes did not take hold after the Second World War. Instead, a different focus took over. \"But the German and Austrian thinking evaporated with the war, and the possibility that sugar was"}, {"q": "What is the tone of the passage?", "options": [{"id": "A", "text": "Cautious and critical"}, {"id": "B", "text": "Humorous and sarcastic"}, {"id": "C", "text": "Indifferent and passive"}, {"id": "D", "text": "Aggressive and confrontational"}], "answer": "A", "solution": "The correct answer is ' Option 1 '. Key Points A) The author carefully examines the history and current understanding of the causes of obesity and diabetes, questioning established paradigms and suggesting that they should be reconsidered. This reflects a cautious and critical tone. \"Whether this is the case with the current epidemics is an all-too"}, {"q": "What is the main idea of the passage?", "options": [{"id": "A", "text": "The causes of obesity and diabetes have always been correctly understood."}, {"id": "B", "text": "Persistent misconceptions and paradigms in nutrition science have led to possibly flawed assumptions about the causes of obesity and diabetes, which may need to be reconsidered."}, {"id": "C", "text": "Sugar has never been considered as a possible cause of chronic diseases."}, {"id": "D", "text": "Pathological science only exists in the field of chemistry."}], "answer": "B", "solution": "The correct answer is ' Option 2 '. Key Points A) The passage explores the idea that misconceptions and entrenched paradigms in the field of nutrition science have potentially led to flawed assumptions about the causes of obesity and diabetes. This is highlighted by the historical shift in thinking and the possibility that the role of sugar has bee"}, {"q": "What is the closest antonym for “paralysed” as used in the passage?", "options": [{"id": "A", "text": "Awake"}, {"id": "B", "text": "Restless"}, {"id": "C", "text": "Mobile"}, {"id": "D", "text": "Exhausted"}], "answer": "C", "solution": "The correct answer is: Option 3) Mobile i.e. 'Mobile'. Key Points The word \"paralysed\" means unable to move or act. (लकवाग्रस्त) Example: After the accident, he was paralyzed from the waist down. \"Mobile\" means able to move or be moved freely or easily. (गतिशील) Example: After the surgery, the patient became mobile again and could walk without assi"}, {"q": "What can be concluded about the cultural reporting of sleep paralysis?", "options": [{"id": "A", "text": "The biological experience is similar across cultures, but its interpretation varies according to local folklore and beliefs."}, {"id": "B", "text": "Only modern cultures report sleep paralysis."}, {"id": "C", "text": "Sleep paralysis is unique to Japanese culture."}, {"id": "D", "text": "Cultures without television do not report sleep paralysis."}], "answer": "A", "solution": "The correct answer is ' Option 1 '. Key Points A) The passage indicates that sleep paralysis is reported across a variety of cultures, but the interpretations of the experience are influenced by local folklore and beliefs. The author mentions that \"cultural beliefs and folklores shape the interpretation of these experiences\" even though the biologi"}, {"q": "According to the passage, what is the biological purpose of paralysis during REM sleep?", "options": [{"id": "A", "text": "To ensure deeper sleep"}, {"id": "B", "text": "To prevent people from acting out their dreams and endangering themselves or others"}, {"id": "C", "text": "To cause hallucinations"}, {"id": "D", "text": "To help people remember their dreams"}], "answer": "B", "solution": "The correct answer is ' Option 2 '. Key Points A) The passage explains that paralysis during REM sleep is to prevent individuals from acting out their dreams, which could potentially endanger themselves or their sleeping partners. \"If we weren’t paralysed, we would act out our dreams, endangering ourselves and our sleeping partners.\" This supports "}, {"q": "What is the tone of the passage?", "options": [{"id": "A", "text": "Informative and personal"}, {"id": "B", "text": "Humorous and mocking"}, {"id": "C", "text": "Indifferent and detached"}, {"id": "D", "text": "Aggressive and confrontational"}], "answer": "A", "solution": "The correct answer is ' Option 1 '. Key Points A) The passage provides detailed information about sleep paralysis, its connection to REM sleep, and its cultural significance. It also includes the author's personal experiences, making the tone both informative and personal. This supports Option 1: \"Informative and personal.\" Therefore, the tone of t"}, {"q": "What is the main idea of the passage?", "options": [{"id": "A", "text": "REM sleep is not important for humans."}, {"id": "B", "text": "Only people with mental health issues experience sleep paralysis."}, {"id": "C", "text": "Sleep paralysis is a common and terrifying phenomenon, rooted in REM sleep, often accompanied by vivid hallucinations and widely reported across cultures."}, {"id": "D", "text": "Dreams have no connection to physical sensations."}], "answer": "C", "solution": "The correct answer is ' Option 3 '. Key Points A) The passage describes the phenomenon of sleep paralysis, its connection to REM sleep, and the terrifying hallucinations that accompany it. The author shares personal experiences of sleep paralysis and explains how it has been reported across different cultures. This supports Option 3: \"Sleep paralys"}]}, "modern-history": {"subject": "general-awareness", "topic": "Modern History", "title": "CT 31: Modern History - Miscellaneous", "provider": "Testbook", "duration": null, "questions": [{"q": "Match the following Social-reforms and their leaders in India. (A) Raja Rammohan Roy (1) Theosophical Society (B) Mahadev Gobind Ranade (2) Tattavabodhini Sabha (C) Debendranath Tagore (3) Atmiya Sabha (D) Annie Besant (4) Prarthana Samaj", "options": [{"id": "A", "text": "(A)-(3), (B)-(4), (C)-(2), (D)-(1)"}, {"id": "B", "text": "(A)-(1), (B)-(4), (C)-(2), (D)-(3)"}, {"id": "C", "text": "(A)-(3), (B)-(2), (C)-(1), (D)-(4)"}, {"id": "D", "text": "(A)-(4), (B)-(2), (C)-(3), (D)-(1)"}], "answer": "A", "solution": "Raja Rammohan Roy is associated with Atmiya Sabha (3), Mahadev Gobind Ranade with Prarthana Samaj (4), Debendranath Tagore with Tattvabodhini Sabha (2), and Annie Besant with Theosophical Society (1). These leaders contributed to key social reforms in India through their respective organizations."}, {"q": "On 8 th April 1929, who among the following two revolutionists threw a bomb in the Central Legislative Assembly?", "options": [{"id": "A", "text": "Bhagat Singh and Rajguru"}, {"id": "B", "text": "Bhagat Singh and Ram Prasad Bismil"}, {"id": "C", "text": "Bhagat Singh and Batukeshwar Dutt"}, {"id": "D", "text": "Bhagat Singh and Sukhdev"}], "answer": "C", "solution": "The question highlights the revolutionary act of Bhagat Singh and Batukeshwar Dutt, who threw a bomb in the Central Legislative Assembly on 8th April 1929 to protest oppressive British laws. Their intent was not to harm but to draw attention. They were arrested after distributing pamphlets and shouting anti-colonial slogans."}, {"q": "Which of the following statements is correct with respect to the Nehru Report of 1928?", "options": [{"id": "A", "text": "It was drafted by the Jawahar Lal Nehru."}, {"id": "B", "text": "The report defined 'Independent Republic' as the form of government desired by India."}, {"id": "C", "text": "The Report recommended Dominion status"}, {"id": "D", "text": "When the Nehru Report was published, Lord Birkenhead was the Viceroy of British India."}], "answer": "C", "solution": "Nehru Report, 1928: It was drafted by the Motilal Nehru. Hence option 1 is incorrect. This report defined Dominion Status as the form of government desired by India. Hence option 2 is incorrect. The Report recommended Universal Adult Suffrage. Hence option 3 is correct. At that time, Lord Irwin was the Viceroy of British India. Hence option 4 is in"}, {"q": "Where was the government of ‘Free India’ inaugurated by Subhash Chandra Bose?", "options": [{"id": "A", "text": "Rangoon"}, {"id": "B", "text": "Calcutta"}, {"id": "C", "text": "Tokyo"}, {"id": "D", "text": "Singapore"}], "answer": "D", "solution": "Option 4 is correct, i.e. Singapore . The government of ‘Free India’ was inaugurated by Subhash Chandra Bose in Singapore . The Provisional Government of Free India was founded in October 1943 by Subhas Chandra Bose . The Provisional Government of Free India also known as the Azad Hind Government. It was influenced by Neta Ji Subhash Chandra Bose ,"}, {"q": "The ________ commercial companies set up their base in India during the Mughal Empire at Masulipatnam in 1605.", "options": [{"id": "A", "text": "British"}, {"id": "B", "text": "French"}, {"id": "C", "text": "Portuguese"}, {"id": "D", "text": "Dutch"}], "answer": "D", "solution": "The Dutch established their bases at various places such as Cochin, Masulipatnam, Negapatam and Pulicat . The French establishments included Karikal, Mahe, Chandernagore, Pondicherry etc. The Portuguese establishments included Cochin, Goa etc. The British established bases in Surat, Bombay, Calcutta and Madras initially."}, {"q": "Who is the writer of the song “Sare Jahan Se Achha Hindustan Hamara”?", "options": [{"id": "A", "text": "Mohammad Iqbal"}, {"id": "B", "text": "Rabindranath Tagore"}, {"id": "C", "text": "Chandra Shekhar Azad"}, {"id": "D", "text": "Bhagat Singh"}], "answer": "A", "solution": "Mohammad Iqbal wrote the song \"Sare Jahan Se Achha Hindustan Hamara.\" This Urdu song, also known as \"Tarana-e-Hind,\" was published on August 16, 1904, in the weekly journal Ittihad."}, {"q": "Which British retired Civil Service Officer took the initiative to convene the first meeting of the Indian National Union?", "options": [{"id": "A", "text": "John Morley"}, {"id": "B", "text": "Edwin Montagu"}, {"id": "C", "text": "Allan Octavian Hume"}, {"id": "D", "text": "Gilbert Elliot"}], "answer": "C", "solution": "Allan Octavian Hume convened the first meeting of the Indian National Union in 1884, which later evolved into the Indian National Congress (INC). The first session of INC was held in 1885 in Bombay, presided over by W.C. Bannerji, with 72 delegates attending."}, {"q": "The Tri-Color which was hoisted in Stuttgart by Madam Cama was smuggled into British India by:", "options": [{"id": "A", "text": "Veer Savarkar"}, {"id": "B", "text": "Kishan Singh"}, {"id": "C", "text": "Indulal Yagnik"}, {"id": "D", "text": "Bhikaji Cama"}], "answer": "C", "solution": "The correct answer is Indulal Yagnik . The Tri-Color which was hoisted in Stuttgart by Madam Cama was smuggled into British India by Indulal Yagnik . Key Points Madam Bhikaji Cama: She was the first lady to first hoist India’s flag on foreign soil. The tri-colour flag was hoisted at the International Socialist Conference at Stuttgart in Germany in "}, {"q": "Read the following statements with reference to the First War of Indian Independence, 1857 and choose the CORRECT option. a) It is also known as the Sepoy Mutiny. b) It was started in Udhampur district of Jammu and Kashmir. c) It was widespread in Delhi, Agra, Kanpur, and Lucknow.", "options": [{"id": "A", "text": "All a, b, c are TRUE"}, {"id": "B", "text": "a and c are TRUE and b is FALSE"}, {"id": "C", "text": "All a, b, c are FALSE"}, {"id": "D", "text": "a and b are TRUE and c is FALSE"}], "answer": "B", "solution": "The correct answer is a and c are TRUE and b is FALSE . Key Points The revolt of 1857 is also known as the first war of Independence . First started on 10 th May 1857 in Meerut by Indian troops of British East India Company . As the revolt started with the mutiny of Indian troops or also were called sepoys the revolt is also known as Sepoy Mutiny ."}, {"q": "Which of the following pairs is not correctly matched?", "options": [{"id": "A", "text": "Hector Munro - Battle of Buxar"}, {"id": "B", "text": "Lord Hastings - Anglo-Nepal War"}, {"id": "C", "text": "Lord wellesely - Fourth Anglo Mysore War"}, {"id": "D", "text": "Lord Cornwallis - Third Anglo-Maratha War"}], "answer": "D", "solution": "The pair \"Lord Cornwallis - Third Anglo-Maratha War\" is incorrectly matched. The Third Anglo-Maratha War (1817-1818) was led by Governor-General Lord Hastings, not Lord Cornwallis. Therefore, this pair is not correctly matched."}]}, "full-mock-demo": {"subject": "full", "topic": "SSC CGL Full Mock", "title": "SSC CGL Mocks 2025 - SSC Super Practice #57", "provider": "Oliveboard", "duration": 10, "questions": [{"q": "In a 5-km race, A beats B by 750 metres and C by 1260 metres. By how many metres does B beat C in the same race? 5 किलोमीटर की दौड़ में, A, B को 750 मीटर से और C को 1260 मीटर से हराता है। उसी दौड़ में B, C को कितने मीटर से हराता है?", "options": [{"id": "A", "text": "700 metres 700 मीटर"}, {"id": "B", "text": "600 metres 600 मीटर"}, {"id": "C", "text": "500 metres 500 मीटर"}, {"id": "D", "text": "400 metres 400 मीटर"}], "answer": "B", "solution": "Let B beat C by T metres. Length of race course = Distance covered by A = 5 km = 5000 m Distance covered by B = 5000 - 750 = 4250 m Distance covered by C = 5000 - 1260 = 3740 m And Distance covered by B = 5000 m Distance covered by C = 5000 - T m Now, 5000/(5000 - T) = 4250/3740 5000 - T = 4400 T = 600 m"}, {"q": "In a 100-m race, A beats B by 20 m and B beats C by 5 m. In the same race, find the distance by which A beats C. 100 मीटर की दौड़ में, A, B को 20 मीटर से हराता है और B, C को 5 मीटर से हराता है। उसी दौड़ में, वह दूरी ज्ञात कीजिए जिससे A, C को हराता है।", "options": [{"id": "A", "text": "22 m 22 मी"}, {"id": "B", "text": "24 m 24 मी"}, {"id": "C", "text": "26 m 26 मी"}, {"id": "D", "text": "25 m 25 मी"}], "answer": "B", "solution": "Ratio of speeds of A and B = 100 : 80 = 5 : 4 Ratio of speeds of B and C = 100 : 95 = 20 : 19 Ratio of speeds of A and C = 5/4 * 20/19 = 25/19 When A runs 100 m, C runs (19/25) * 100 = 76 m A beats C by = 100 - 76 = 24 m"}, {"q": "P and Q take part in 400 m race. P runs at 12 km/hr. P gives Q a start of 20 m and still beats him by 13 seconds. The speed of Q is: (Round up to two decimal places.) P और Q 400 मीटर की दौड़ में भाग लेते हैं। P 12 किमी/घंटा की गति से दौड़ता है। P, Q से 20 मीटर आगे रहता है और फिर भी उसे 13 सेकंड से हरा देता है। Q की गति है: (दो दशमलव स्थानों तक पूर्णांकित करें।)", "options": [{"id": "A", "text": "11.38 km/hr 11.38 किमी/घंटा"}, {"id": "B", "text": "10.29 km/hr 10.29 किमी/घंटा"}, {"id": "C", "text": "11.61 km/hr 11.61 किमी/घंटा"}, {"id": "D", "text": "10.87 km/hr 10.87 किमी/घंटा"}], "answer": "B", "solution": "Time taken by P to complete the race = (400/1000)/(12) = 1/30 hours Time taken by Q to complete the race = 1/30 + 13/3600 = 133/3600 hours Distance covered by Q = 400 - 20 = 380 m = 0.38 km Speed of Q = 0.38/(133/3600) = 10.29 km/hr"}, {"q": "Atul gives Vishu a head-start of 20 seconds in a 900 m race and beats him by 135 m. While running the same race again Atul gives a start of 189 m and beats him by 8 seconds. In how much time can Vishu complete the full race of 900 m? अतुल 900 मीटर की दौड़ में विशु को 20 सेकंड की बढ़त देता है और उसे 135 मीटर से पीछे छोड़ देता है। उसी दौड़ में फिर से भागते समय अतुल 189 मीटर की बढ़त देता है और उसे 8 सेकंड से पीछे छोड़ देता है। विशु 900 मीटर की पूरी दौड़ कितने समय में पूरी कर सकता है?", "options": [{"id": "A", "text": "3 minutes 30 seconds 3 मिनट 30 सेकंड"}, {"id": "B", "text": "2 minutes 50 seconds 2 मिनट 50 सेकंड"}, {"id": "C", "text": "3 minutes 20 seconds 3 मिनट 20 सेकंड"}, {"id": "D", "text": "3 minutes 10 seconds 3 मिनट 10 सेकंड"}], "answer": "C", "solution": "Here Atul's speed as A m/s Vishu's speed as V m/s Let:- Time taken by Atul to cover 900m as Ta seconds Time taken by Vishu to cover 900m as Ty seconds Atu's speed: 900/T a Vishu's speed in the first race; 765/ T a +20 vishu's speed in the second race: 711/T a +8 Equating the two speeds: 765/ T a +20=711/T a +8 Multiply both sides by (Ta + 20)(Ta +8"}, {"q": "Arun and Bhaskar run a race of 3 km. First, Arun gives Bhaskar a head start of 400 m and beats him by 30 seconds. While coming back, Arun gives Bhaskar a lead of 2.5 minutes and gets beaten by 500 m. What is the difference between the times in minutes in which Arun and Bhaskar can run the race for one side separately? अरुण और भास्कर 3 किलोमीटर की दौड़ लगाते हैं। सबसे पहले, अरुण भास्कर को 400 मीटर की बढ़त देता है और उसे 30 सेकंड से हरा देता है। वापस आते समय, अरुण भास्कर को 2.5 मिनट की बढ़त देता है और 500 मीटर से पीछे हो जाता है। अरुण और भास्कर द्वारा एक पक्ष के लिए अलग-अलग दौड़ लगाने में लगने वाले समय (मिनटों में) में क्या अंतर है?", "options": [{"id": "A", "text": "3 min 3 मिनट"}, {"id": "B", "text": "1.5 min 1.5 मिनट"}, {"id": "C", "text": "2.5 min 2.5 मिनट"}, {"id": "D", "text": "2 min 2 मिनट"}], "answer": "B", "solution": "Let: Arun's speed = A m/s Bhaskar's speed = B m/s Race distance = 3000 m First Scenario: Bhaskar runs 2600 m (3000 - 400). Let T be the time (in seconds) for Arun to run 3000 m: A = 3000/T. Bhaskar takes (T + 30) seconds to finish 2600 m: B = 2600/(T + 30). Second Scenario: Bhaskar gets a 2.5-minute (150 s) lead. Bhaskar's time for 3000 m: x = 3000"}, {"q": "In an 800 m race, the ratio of the speeds of two contestants Ankur and Neha is 5:6. If Ankur has a head-start of 200 m, then Ankur will win by 800 मीटर की दौड़ में, दो प्रतियोगियों अंकुर और नेहा की गति का अनुपात 5:6 है। यदि अंकुर 200 मीटर की बढ़त लेता है, तो अंकुर जीत जाएगा।", "options": [{"id": "A", "text": "89 m 89 मी"}, {"id": "B", "text": "80 m 80 मी"}, {"id": "C", "text": "76 m 76 मी"}, {"id": "D", "text": "69 m 69 मी"}], "answer": "B", "solution": "Speeds: Ankur:Neha = 5:6 Ankur runs 600 m (800-200), Neha runs 800 m Time = Distance / Speed t₁ = 600/5 = 120, t₂ = 800/6 = 133.33 Ankur finishes first Neha's distance in 120 = 6 X 120 = 720 m Ankur wins by 800 - 720 = 80 m Option (b) is the correct answer."}, {"q": "Tarun gives Hari a head-start of 60 seconds in a 2400 m race and still beats him by 40 seconds. If the speed of Hari is 6 m/s, find the speed of Tarun. तरुण 2400 मीटर की दौड़ में हरि से 60 सेकंड आगे रहता है और फिर भी उसे 40 सेकंड से हरा देता है। यदि हरि की गति 6 मीटर/सेकंड है, तो तरुण की गति ज्ञात कीजिए।", "options": [{"id": "A", "text": "8.5 m/s 8.5 मीटर/सेकेंड"}, {"id": "B", "text": "7.5 m/s 7.5 मीटर/सेकेंड"}, {"id": "C", "text": "8 m/s 8 मीटर/सेकेंड"}, {"id": "D", "text": "7 m/s 7 मी/से"}], "answer": "C", "solution": "Hari's time = 2400 / 6 = 400 s Tarun's time = 400 - 60 - 40 = 300 s Tarun's speed = 2400 / 300 = 8 m/s Option (c) is the correct answer"}, {"q": "In a 2 km linear race, if P completes the race in 200 seconds and Q in 220 seconds, then the distance by which P beats Q is: 2 किमी की रैखिक दौड़ में, यदि P 200 सेकंड में दौड़ पूरी करता है और Q 220 सेकंड में, तो P द्वारा Q को हरायी गयी दूरी है:", "options": [{"id": "A", "text": "167(6/11) metres 167(6/11) मीटर"}, {"id": "B", "text": "173(7/11) metres 173(7/11) मीटर"}, {"id": "C", "text": "191(7/11) metres 191(7/11) मीटर"}, {"id": "D", "text": "181(9/11) metres 181(9/11) मीटर"}], "answer": "D", "solution": "Distance = 2000 m P's speed = 2000 / 200 = 10 m/s Q's speed = 2000 / 220 = 100/11 m/s In 200 s, Q runs: (100/11) * 200 = 20000/11 m Remaining distance: 2000 - 20000/11 = 2000/11 = 181(9/11) m"}, {"q": "In a race of 1200 m, Ram can beat Shyam by 200 m or by 20 sec. What must be the speed of Ram? 1200 m की एक दौड़ में राम श्याम को 200 m या 20 सेकंड से हरा सकता है, तो राम की चाल कितनी होनी चाहिए?", "options": [{"id": "A", "text": "14 m/sec 14 m/sec"}, {"id": "B", "text": "12 m/sec 12 m/sec"}, {"id": "C", "text": "10 m/sec 10 m/sec"}, {"id": "D", "text": "16 m/sec 16 m/sec"}], "answer": "B", "solution": "Let the speed of Ram and Shyam is 'a' m/sec and 'b' m/sec respectively. Since, Ram beat Shyam by 200 m which means when Ram finishes the race of 1200 m, Shyam can finish only 1000 m. So, Also, Ram beat Shyam by 20 sec which means time taken by Shyam to finish the race is 20 sec more than the time taken by Ram to finish the race. So, From equation ("}, {"q": "In a 1500 m race, Anil beats Bakul by 150 m and in the same race Bakul beats Charles by 75 m. By what distance does Anil beat Charles? 1500 m की एक दौड़ में, अनिल ने बकुल को 150 m से हराया और समान दौड़ में बकुल ने चार्ल्स को 75 m से हराया। अनिल ने चार्ल्स को कितनी दूरी से हराया?", "options": [{"id": "A", "text": "217.50 m 217.50 m"}, {"id": "B", "text": "200.15 m 200.15 m"}, {"id": "C", "text": "293.50 m 293.50 m"}, {"id": "D", "text": "313.75 m 313.75 m"}], "answer": "A", "solution": "Since, Anil beats Bakul by 150 m. Which means when Anil complete 1500 m, Bakul completed only 1350 m. Also, Bakul beats Charles by 75 m. Which means when Bakul complete 1500 m, Charles completed only 1425 m. Total distance covered by Charles when Bakul completes only 1350 m = 1425 * (1350/1500) = 1282.5 m Hence, the distance by which Anil beats Cha"}]}};

// Real counts pulled from the organized tests/ directory
const SECTIONAL_COUNTS = {
  "quantitative-aptitude": {
    label: "Quantitative Aptitude", icon: Sigma, color: "#22c55e", total: 863,
    topics: [
      ["simplification", "Simplification", 54], ["geometry", "Geometry", 44],
      ["number-system", "Number System", 39], ["mensuration", "Mensuration", 38],
      ["profit-loss", "Profit & Loss", 35], ["algebra", "Algebra", 34],
      ["trigonometry", "Trigonometry", 32], ["data-interpretation", "Data Interpretation", 29],
      ["average", "Average", 21], ["time-work", "Time & Work", 21],
      ["percentage", "Percentage", 20], ["time-speed-distance", "Time, Speed & Distance", 19],
      ["ratio-proportion", "Ratio & Proportion", 16], ["simple-interest", "Simple Interest", 13],
      ["compound-interest", "Compound Interest", 10], ["discount", "Discount", 8],
      ["pipes-cisterns", "Pipes & Cisterns", 3], ["boats-streams", "Boats & Streams", 2],
      ["trains", "Trains", 2],
    ],
  },
  "reasoning": {
    label: "Reasoning", icon: Brain, color: "#f97316", total: 693,
    topics: [
      ["analogy", "Analogy", 60], ["coding-decoding", "Coding-Decoding", 49],
      ["figure-based", "Figure Based", 43], ["series", "Series", 31],
      ["classification", "Classification", 22], ["mathematical-operations", "Mathematical Operations", 18],
      ["blood-relations", "Blood Relations", 16], ["syllogism", "Syllogism", 15],
      ["mirror-image", "Mirror Image", 11], ["paper-folding", "Paper Folding", 10],
      ["puzzle", "Puzzle", 10], ["venn-diagram", "Venn Diagram", 10],
      ["direction-distance", "Direction & Distance", 9], ["seating-arrangement", "Seating Arrangement", 8],
      ["calendar", "Calendar", 7], ["ranking-order", "Ranking & Order", 5],
      ["statement-conclusion", "Statement & Conclusion", 5],
    ],
  },
  "english": {
    label: "English", icon: BookOpen, color: "#3b82f6", total: 535,
    topics: [
      ["reading-comprehension", "Reading Comprehension", 75], ["idioms-phrases", "Idioms & Phrases", 29],
      ["grammar", "Grammar", 26], ["fill-in-the-blanks", "Fill in the Blanks", 20],
      ["vocabulary", "Vocabulary", 20], ["cloze-test", "Cloze Test", 19],
      ["error-spotting", "Error Spotting", 16], ["active-passive", "Active/Passive", 14],
      ["antonyms", "Antonyms", 14], ["synonyms", "Synonyms", 13],
      ["direct-indirect", "Direct/Indirect", 10], ["spelling", "Spelling", 10],
      ["one-word-substitution", "One Word Substitution", 9], ["para-jumbles", "Para Jumbles", 7],
      ["sentence-improvement", "Sentence Improvement", 3], ["tenses", "Tenses", 2],
    ],
  },
  "general-awareness": {
    label: "General Awareness", icon: Landmark, color: "#ef4444", total: 863,
    topics: [
      ["geography", "Geography", 68], ["static-gk", "Static GK", 63],
      ["polity", "Polity", 59], ["economics", "Economics", 54],
      ["current-affairs", "Current Affairs", 51], ["modern-history", "Modern History", 44],
      ["computer-awareness", "Computer Awareness", 42], ["art-culture", "Art & Culture", 38],
      ["biology", "Biology", 34], ["ancient-history", "Ancient History", 30],
      ["medieval-history", "Medieval History", 30], ["chemistry", "Chemistry", 21],
      ["physics", "Physics", 17], ["science-technology", "Science & Technology", 16],
      ["general-science", "General Science", 10], ["environment", "Environment", 9],
      ["constitution", "Constitution", 1],
    ],
  },
};

const FULL_MOCK_PROVIDERS = [
  { key: "testbook", label: "Testbook", count: 415 },
  { key: "oliveboard", label: "Oliveboard", count: 1287 },
  { key: "rbe-mocks", label: "RBE Mocks", count: 198 },
  { key: "pundits", label: "Pundits", count: 13 },
];
const OTHER_EXAMS_COUNT = 142;

const RECENT_SEED = [
  { id: "seed-1", title: "SSC CGL Tier 1 Mock #24", provider: "Testbook", score: 82, total: 100, when: "Today", color: "#ef4444" },
  { id: "seed-2", title: "SSC CGL Sectional Mock", provider: "Oliveboard", score: 34, total: 50, when: "Yesterday", color: "#f97316" },
  { id: "seed-3", title: "Number System Practice", provider: "RBE", score: 18, total: 25, when: "2 days ago", color: "#22c55e" },
  { id: "seed-4", title: "Modern History PYQ", provider: "Pundits", score: 21, total: 25, when: "3 days ago", color: "#ef4444" },
];

const WEAK_TOPICS = [
  { key: "percentage", label: "Percentage", subject: "quantitative-aptitude", acc: 58 },
  { key: "time-work", label: "Time & Work", subject: "quantitative-aptitude", acc: 61 },
  { key: "syllogism", label: "Syllogism", subject: "reasoning", acc: 65 },
  { key: "modern-history", label: "Modern History", subject: "general-awareness", acc: 63 },
];

const SUBJECT_PROGRESS_BASE = {
  "quantitative-aptitude": { label: "Quantitative Aptitude", solved: 342, total: 800, acc: 72, color: "#22c55e", icon: Sigma },
  "reasoning": { label: "Reasoning", solved: 284, total: 800, acc: 68, color: "#f97316", icon: Brain },
  "english": { label: "English", solved: 284, total: 800, acc: 71, color: "#3b82f6", icon: BookOpen },
  "general-awareness": { label: "General Awareness", solved: 260, total: 800, acc: 65, color: "#ef4444", icon: Landmark },
};

/* ============================================================
   STORAGE HELPERS
   ============================================================ */
async function loadResults() {
  try {
    const r = await window.storage.get("taxelea:results", false);
    return r ? JSON.parse(r.value) : [];
  } catch (e) {
    return [];
  }
}
async function saveResults(results) {
  try { await window.storage.set("taxelea:results", JSON.stringify(results), false); } catch (e) {}
}
async function loadBookmarks() {
  try {
    const r = await window.storage.get("taxelea:bookmarks", false);
    return r ? JSON.parse(r.value) : [];
  } catch (e) { return []; }
}
async function saveBookmarks(bm) {
  try { await window.storage.set("taxelea:bookmarks", JSON.stringify(bm), false); } catch (e) {}
}

/* ============================================================
   LOGO
   ============================================================ */
function Logo({ compact }) {
  return (
    <div className="flex items-center gap-3">
      <svg width="40" height="40" viewBox="0 0 40 40" className="shrink-0">
        <circle cx="20" cy="20" r="18.5" fill="none" stroke="#3a3a3d" strokeWidth="1.2" />
        <circle cx="20" cy="20" r="15.5" fill="none" stroke="#6b6b6e" strokeWidth="0.6" />
        <text x="20" y="27" textAnchor="middle" fontFamily="Georgia, serif" fontSize="18" fill="#e5e5e5">T</text>
      </svg>
      {!compact && (
        <div className="leading-tight">
          <div className="text-[var(--text-primary)] font-semibold tracking-[0.15em] text-[15px]" style={{ fontFamily: "Georgia, serif" }}>TAXELEA</div>
          <div className="text-[10px] text-[var(--text-faint)] tracking-wide">Smart Test Preparation</div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */
function Card({ children, className = "" }) {
  return (
    <div className={`bg-[var(--card-bg)] border border-[var(--border)] rounded-xl ${className}`}>
      {children}
    </div>
  );
}

function DonutProgress({ value, size = 72, stroke = 7, color = "#ef4444" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2a2a2d" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" />
    </svg>
  );
}

function StatCard({ icon: Icon, label, value, sub, subColor, iconColor, ring }) {
  return (
    <Card className="p-4 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[var(--text-muted)] text-xs mb-3">{label}</div>
          {ring ? (
            <div className="flex items-center gap-3">
              <div className="relative">
                <DonutProgress value={ring} color={iconColor} />
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[var(--text-primary)]">{ring}%</div>
              </div>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[var(--text-primary)]">{value}</span>
              {sub && <span className="text-xs text-[var(--text-faint)]">{sub}</span>}
            </div>
          )}
        </div>
        {!ring && <Icon size={20} style={{ color: iconColor }} strokeWidth={2} />}
      </div>
      {subColor && <div className="text-xs mt-1 font-medium" style={{ color: subColor }}>{subColor.text}</div>}
    </Card>
  );
}

/* ============================================================
   SIDEBAR
   ============================================================ */
const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: Home },
  { key: "sectional", label: "Sectional Mocks", icon: ClipboardList },
  { key: "full", label: "Full Test Series", icon: Layers },
  { key: "practice", label: "Practice", icon: Dumbbell },
  { key: "performance", label: "Performance", icon: BarChart3 },
  { key: "bookmarks", label: "Bookmarks", icon: Bookmark },
  { key: "streak", label: "Streak", icon: Flame },
  { key: "settings", label: "Settings", icon: Settings },
];

function Sidebar({ page, setPage, onClose }) {
  return (
    <div className="w-[232px] shrink-0 bg-[var(--sidebar-bg)] border-r border-[var(--border)] flex flex-col h-full overflow-y-auto">
      <div className="px-5 pt-6 pb-6 border-b border-[var(--border)] flex items-center justify-between">
        <Logo />
        {onClose && (
          <button onClick={onClose} className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-muted)] shrink-0">
            <X size={18} />
          </button>
        )}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = page === item.key;
          return (
            <button
              key={item.key}
              onClick={() => { setPage(item.key); if (onClose) onClose(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors relative ${
                active
                  ? "bg-gradient-to-r from-red-900/40 to-transparent text-[var(--text-primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]"
              }`}
            >
              {active && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-red-600 rounded-r" />}
              <item.icon size={17} strokeWidth={1.8} className={active ? "text-red-500" : ""} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="m-3 p-4 rounded-xl border border-[var(--accent-soft-border)] bg-gradient-to-b from-[var(--accent-soft-bg)] to-transparent">
        <div className="flex items-center gap-1.5 text-[var(--text-primary)] font-semibold text-sm mb-1.5">
          Keep the Streak Alive! <Flame size={14} className="text-red-500" fill="#ef4444" />
        </div>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">
          Your consistency today builds your success tomorrow.
        </p>
        <button onClick={() => { setPage("streak"); if (onClose) onClose(); }} className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-red-500 border border-[var(--accent-soft-border)] rounded-lg py-2 hover:bg-[var(--accent-soft-bg)] transition-colors">
          View Streak <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   HEADER
   ============================================================ */
function Header({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="h-[60px] sm:h-[68px] shrink-0 border-b border-[var(--border)] flex items-center justify-between px-3 sm:px-6 gap-2 sm:gap-4">
      <button onClick={onMenuClick} className="lg:hidden w-9 h-9 shrink-0 flex items-center justify-center rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-secondary)]">
        <Menu size={19} />
      </button>
      <button className="hidden sm:flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--border-strong)] rounded-lg px-3.5 py-2 text-sm text-[var(--text-secondary)] shrink-0">
        SSC CGL <ChevronDown size={14} className="text-[var(--text-faint)]" />
      </button>
      <div className="flex-1 max-w-xl relative min-w-0">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
        <input
          placeholder="Search exams, tests, topics..."
          className="w-full bg-[var(--card-bg)] border border-[var(--border-strong)] rounded-lg pl-10 pr-4 py-2 sm:py-2.5 text-sm text-[var(--text-secondary)] placeholder:text-[var(--text-faint)] outline-none focus:border-red-800"
        />
      </div>
      <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-secondary)]"
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-secondary)]">
          <Bell size={17} />
          <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white font-medium">3</span>
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-red-700 flex items-center justify-center text-white text-sm font-semibold shrink-0">T</div>
          <div className="leading-tight hidden md:block">
            <div className="text-sm text-[var(--text-primary)] font-medium">Tanishq</div>
            <div className="text-[11px] text-red-500">Premium User</div>
          </div>
          <ChevronDown size={14} className="hidden md:block text-[var(--text-faint)]" />
        </div>
      </div>

    </div>
  );
}

/* ============================================================
   ACTIVITY CALENDAR (illustrative heatmap in the site's palette)
   ============================================================ */
function ActivityCalendar() {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const weeks = 48;
  const cell = useMemo(() => {
    const seeded = [];
    let s = 42;
    const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let w = 0; w < weeks; w++) {
      const col = [];
      for (let d = 0; d < 7; d++) {
        const isWeekday = d < 5;
        const base = rand();
        const val = isWeekday ? base * 0.75 + 0.2 : base * 0.4;
        col.push(val);
      }
      seeded.push(col);
    }
    return seeded;
  }, []);
  const colorFor = (v) => {
    if (v < 0.15) return "#1a1a1c";
    if (v < 0.35) return "#4c1414";
    if (v < 0.55) return "#7a1c1c";
    if (v < 0.75) return "#b32323";
    return "#ef4444";
  };
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 text-[var(--text-primary)] font-semibold text-sm">
          Activity Calendar <Info size={13} className="text-[var(--text-faint)]" />
        </div>
        <button className="flex items-center gap-1 text-xs text-[var(--text-muted)] border border-[var(--border-strong)] rounded-lg px-2.5 py-1.5 shrink-0">
          This Year <ChevronDown size={12} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <div style={{ minWidth: `${28 + weeks * 13}px` }}>
          <div className="flex text-[10px] text-[var(--text-faint)] mb-1.5" style={{ paddingLeft: 28 }}>
            {months.map((m) => (
              <div key={m} style={{ width: `${13 * (weeks / 12)}px` }}>{m}</div>
            ))}
          </div>
          <div className="flex gap-[3px]">
            <div className="flex flex-col gap-[3px] text-[10px] text-[var(--text-faint)] justify-between shrink-0" style={{ width: 24 }}>
              {days.map((d) => <div key={d} className="h-[11px] leading-[11px]">{d}</div>)}
            </div>
            <div className="flex gap-[3px]">
              {cell.map((col, i) => (
                <div key={i} className="flex flex-col gap-[3px]" style={{ width: 11 }}>
                  {col.map((v, j) => (
                    <div key={j} className="h-[11px] rounded-[2px]" style={{ backgroundColor: colorFor(v) }} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-1.5 mt-3 text-[10px] text-[var(--text-faint)]">
        Less
        {[0.05,0.25,0.45,0.65,0.9].map((v,i) => (
          <div key={i} className="w-[11px] h-[11px] rounded-[2px]" style={{ backgroundColor: colorFor(v) }} />
        ))}
        More
      </div>
    </Card>
  );
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function Dashboard({ setPage, startPractice, results, stats }) {
  const todayCount = 5;
  const todayDone = Math.min(3, stats.todayAnswered);

  const recent = useMemo(() => {
    const attempted = results.slice(0, 4).map((r) => ({
      id: r.id, title: r.title, provider: r.provider, score: r.score, total: r.total,
      when: "Just now", color: r.color || "#ef4444",
    }));
    return [...attempted, ...RECENT_SEED].slice(0, 4);
  }, [results]);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">Good Evening, Aspirant! <span>👋</span></h1>
        <p className="text-[var(--text-faint)] text-sm mt-1">Stay consistent. Every question counts.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Card className="p-4">
          <div className="text-[var(--text-muted)] text-xs mb-3">Current Streak</div>
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-red-500" fill="#ef4444" />
            <span className="text-2xl font-bold text-[var(--text-primary)]">14</span>
            <span className="text-xs text-[var(--text-faint)]">days</span>
          </div>
          <div className="text-xs text-red-500 font-medium mt-1">Keep it up 🔥</div>
        </Card>
        <Card className="p-4">
          <div className="text-[var(--text-muted)] text-xs mb-3">Longest Streak</div>
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-red-500" />
            <span className="text-2xl font-bold text-[var(--text-primary)]">27</span>
            <span className="text-xs text-[var(--text-faint)]">days</span>
          </div>
          <div className="text-xs text-red-500 font-medium mt-1">Best Record! 🏆</div>
        </Card>
        <Card className="p-4">
          <div className="text-[var(--text-muted)] text-xs mb-3">Daily Goal</div>
          <div className="flex items-center gap-2">
            <Target size={18} className="text-red-500" />
            <span className="text-2xl font-bold text-[var(--text-primary)]">{todayDone} / {todayCount}</span>
          </div>
          <div className="text-xs text-[var(--text-faint)] mt-1 mb-1.5">questions</div>
          <div className="h-1 bg-[var(--track-bg)] rounded-full overflow-hidden">
            <div className="h-full bg-red-600" style={{ width: `${(todayDone/todayCount)*100}%` }} />
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-[var(--text-muted)] text-xs mb-3">Questions Solved</div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-red-500" />
            <span className="text-2xl font-bold text-[var(--text-primary)]">{stats.questionsSolved}</span>
          </div>
          <div className="text-xs text-red-500 font-medium mt-1">+{stats.solvedThisWeek} this week</div>
        </Card>
        <Card className="p-4">
          <div className="text-[var(--text-muted)] text-xs mb-3">Accuracy</div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <DonutProgress value={stats.accuracy} size={56} stroke={6} color="#ef4444" />
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[var(--text-primary)]">{stats.accuracy}%</div>
            </div>
          </div>
          <div className="text-xs text-red-500 font-medium mt-1">{stats.accDelta}</div>
        </Card>
        <Card className="p-4">
          <div className="text-[var(--text-muted)] text-xs mb-3">Tests Attempted</div>
          <div className="flex items-center gap-2">
            <ClipboardList size={18} className="text-red-500" />
            <span className="text-2xl font-bold text-[var(--text-primary)]">{stats.testsAttempted}</span>
          </div>
          <div className="text-xs text-red-500 font-medium mt-1">+{stats.testsThisWeek} this week</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[var(--text-primary)] font-semibold text-sm">Today's Practice</div>
            <button className="flex items-center gap-1 text-xs text-[var(--text-muted)] border border-[var(--border-strong)] rounded-lg px-2.5 py-1.5">
              <Calendar size={12} /> Today
            </button>
          </div>
          <div className="text-xl font-bold text-[var(--text-primary)] mb-3">5 Questions</div>
          <div className="flex items-center gap-4 text-xs mb-3">
            <span className="text-green-500 font-medium">2 Easy</span>
            <span className="text-amber-500 font-medium">2 Medium</span>
            <span className="text-red-500 font-medium">1 Hard</span>
          </div>
          <div className="h-1.5 bg-[var(--track-bg)] rounded-full overflow-hidden mb-2">
            <div className="h-full bg-green-500" style={{ width: `${(todayDone/todayCount)*100}%` }} />
          </div>
          <div className="text-xs text-[var(--text-faint)] mb-4">{todayDone} / {todayCount} Completed</div>
          <button onClick={() => startPractice("percentage")} className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-600 transition-colors text-white text-sm font-medium rounded-lg py-2.5">
            Continue Practice <ArrowRight size={15} />
          </button>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[var(--text-primary)] font-semibold text-sm">Continue Practice</div>
            <span className="text-[10px] font-medium text-[var(--danger-text)] bg-[var(--accent-soft-bg)] border border-[var(--accent-soft-border)] rounded px-2 py-1">In Progress</span>
          </div>
          <div className="text-base font-semibold text-[var(--text-primary)]">Percentage</div>
          <div className="text-xs text-[var(--text-faint)] mb-3">Quantitative Aptitude</div>
          <div className="flex items-end justify-between mb-1">
            <span className="text-lg font-bold text-[var(--text-primary)]">27 / 50 <span className="text-xs font-normal text-[var(--text-faint)]">Questions</span></span>
            <div className="text-right">
              <div className="text-lg font-bold text-[var(--text-primary)]">72%</div>
              <div className="text-[10px] text-[var(--text-faint)]">Accuracy</div>
            </div>
          </div>
          <div className="h-1.5 bg-[var(--track-bg)] rounded-full overflow-hidden mb-4 mt-2">
            <div className="h-full bg-red-600" style={{ width: "54%" }} />
          </div>
          <button onClick={() => startPractice("percentage")} className="w-full flex items-center justify-center gap-2 border border-[var(--border-strong)] hover:bg-[var(--hover-bg)] transition-colors text-[var(--text-primary)] text-sm font-medium rounded-lg py-2.5">
            Continue <ArrowRight size={15} />
          </button>
        </Card>

        <ActivityCalendar />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[var(--text-primary)] font-semibold text-sm">Weak Topics</div>
            <button onClick={() => setPage("sectional")} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">View All</button>
          </div>
          <div className="space-y-1">
            {WEAK_TOPICS.map((t) => {
              const meta = SECTIONAL_COUNTS[t.subject];
              const Icon = meta.icon;
              return (
                <div key={t.key} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: meta.color + "22" }}>
                      <Icon size={14} style={{ color: meta.color }} />
                    </div>
                    <span className="text-sm text-[var(--text-secondary)]">{t.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-red-500">{t.acc}%</span>
                    <button onClick={() => startPractice(t.key)} className="flex items-center gap-1 text-xs text-red-500 border border-[var(--accent-soft-border)] rounded-md px-2 py-1 hover:bg-[var(--accent-soft-bg)]">
                      Practice <ArrowRight size={11} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[var(--text-primary)] font-semibold text-sm">Recent Tests</div>
            <button onClick={() => setPage("performance")} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">View All</button>
          </div>
          <div className="space-y-1">
            {recent.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: r.color + "22" }}>
                    <ClipboardList size={14} style={{ color: r.color }} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-[var(--text-secondary)] truncate max-w-[150px]">{r.title}</div>
                    <div className="text-[11px] text-[var(--text-faint)] flex items-center gap-1.5">
                      <span className="bg-[var(--track-bg)] rounded px-1.5">{r.provider}</span> {r.when}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm text-[var(--text-secondary)]">{r.score}/{r.total}</div>
                  <div className="text-xs font-semibold text-red-500">{Math.round((r.score/r.total)*100)}%</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[var(--text-primary)] font-semibold text-sm">Subject Progress</div>
            <button onClick={() => setPage("performance")} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">View All</button>
          </div>
          <div className="space-y-4">
            {Object.entries(stats.subjectProgress).map(([key, sp]) => {
              const Icon = sp.icon;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: sp.color + "22" }}>
                        <Icon size={12} style={{ color: sp.color }} />
                      </div>
                      <span className="text-sm text-[var(--text-secondary)]">{sp.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{sp.acc}%</span>
                  </div>
                  <div className="h-1.5 bg-[var(--track-bg)] rounded-full overflow-hidden">
                    <div className="h-full" style={{ width: `${sp.acc}%`, backgroundColor: sp.color }} />
                  </div>
                  <div className="text-[11px] text-[var(--text-faint)] mt-1">{sp.solved} / {sp.total} questions</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--text-faint)] border-t border-[var(--border)] pt-4">
        <div className="flex items-center gap-2"><Info size={13} /> All data is based on your actual attempts and real test progress.</div>
        <div className="flex items-center gap-1.5">Last updated: Just now <RefreshCw size={12} /></div>
      </div>
    </div>
  );
}

/* ============================================================
   SECTIONAL MOCKS PAGE
   ============================================================ */
function SectionalMocks({ startPractice, bookmarks, toggleBookmark }) {
  const [openSubject, setOpenSubject] = useState("quantitative-aptitude");
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Sectional Mocks</h1>
        <p className="text-[var(--text-faint)] text-sm mt-1">Topic-wise practice drawn from the real SSC CGL question bank — 2,954 tests across 4 subjects.</p>
      </div>
      <div className="space-y-4">
        {Object.entries(SECTIONAL_COUNTS).map(([key, subj]) => {
          const Icon = subj.icon;
          const open = openSubject === key;
          return (
            <Card key={key} className="overflow-hidden">
              <button onClick={() => setOpenSubject(open ? null : key)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--hover-bg)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: subj.color + "22" }}>
                    <Icon size={18} style={{ color: subj.color }} />
                  </div>
                  <div className="text-left">
                    <div className="text-[var(--text-primary)] font-semibold text-sm">{subj.label}</div>
                    <div className="text-xs text-[var(--text-faint)]">{subj.total} tests</div>
                  </div>
                </div>
                <ChevronDown size={16} className={`text-[var(--text-faint)] transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
              {open && (
                <div className="border-t border-[var(--border)] px-4 sm:px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {subj.topics.map(([tkey, tlabel, count]) => {
                    const hasReal = !!EMBEDDED_TESTS[tkey];
                    const bookmarked = bookmarks.includes(tkey);
                    return (
                      <div key={tkey} className="flex items-center justify-between bg-[var(--elevated-bg)] border border-[var(--border)] rounded-lg px-3.5 py-3">
                        <div>
                          <div className="text-sm text-[var(--text-secondary)]">{tlabel}</div>
                          <div className="text-[11px] text-[var(--text-faint)]">{count} tests</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => toggleBookmark(tkey, tlabel, key)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[var(--hover-bg)]">
                            <Bookmark size={13} className={bookmarked ? "text-red-500" : "text-[var(--text-faint)]"} fill={bookmarked ? "#ef4444" : "none"} />
                          </button>
                          <button
                            disabled={!hasReal}
                            onClick={() => hasReal && startPractice(tkey)}
                            className={`text-xs font-medium rounded-md px-2.5 py-1.5 flex items-center gap-1 ${
                              hasReal ? "text-red-500 border border-[var(--accent-soft-border)] hover:bg-[var(--accent-soft-bg)]" : "text-[var(--text-faint)] border border-[var(--border)] cursor-not-allowed"
                            }`}
                          >
                            <Play size={11} /> Start
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   FULL TEST SERIES PAGE
   ============================================================ */
function FullTestSeries({ startPractice }) {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Full Test Series</h1>
        <p className="text-[var(--text-faint)] text-sm mt-1">Complete multi-subject mocks, organized by provider — 2,055 SSC CGL mocks + 142 other-exam mocks.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {FULL_MOCK_PROVIDERS.map((p) => (
          <Card key={p.key} className="p-5">
            <div className="text-[var(--text-primary)] font-semibold text-sm mb-1">{p.label}</div>
            <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">{p.count}</div>
            <div className="text-xs text-[var(--text-faint)] mb-4">full-length SSC CGL mocks</div>
            <button
              onClick={() => startPractice("full-mock-demo")}
              className="w-full flex items-center justify-center gap-2 border border-[var(--border-strong)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] text-xs font-medium rounded-lg py-2"
            >
              Browse <ArrowRight size={13} />
            </button>
          </Card>
        ))}
      </div>
      <Card className="p-5">
        <div className="flex items-center justify-between mb-1">
          <div className="text-[var(--text-primary)] font-semibold text-sm">Other Exams</div>
          <span className="text-xs text-[var(--text-faint)]">{OTHER_EXAMS_COUNT} mocks</span>
        </div>
        <p className="text-xs text-[var(--text-faint)] mb-3">SSC CHSL, CPO, Stenographer, Selection Post, RRB/NTPC and more.</p>
      </Card>
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[var(--text-primary)] font-semibold text-sm">Try a Real Full Mock</div>
        </div>
        <div className="flex items-center justify-between bg-[var(--elevated-bg)] border border-[var(--border)] rounded-lg px-4 py-3.5">
          <div>
            <div className="text-sm text-[var(--text-secondary)] font-medium">{EMBEDDED_TESTS["full-mock-demo"].title}</div>
            <div className="text-[11px] text-[var(--text-faint)] mt-0.5">{EMBEDDED_TESTS["full-mock-demo"].provider} · {EMBEDDED_TESTS["full-mock-demo"].questions.length} questions · All subjects</div>
          </div>
          <button onClick={() => startPractice("full-mock-demo")} className="flex items-center gap-1.5 bg-red-700 hover:bg-red-600 text-white text-xs font-medium rounded-lg px-3.5 py-2">
            <Play size={12} /> Start Mock
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ============================================================
   PRACTICE / TEST TAKING
   ============================================================ */
function PracticeRunner({ testKey, onExit, onComplete }) {
  const test = EMBEDDED_TESTS[testKey];
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!test) return null;
  const q = test.questions[idx];
  const total = test.questions.length;

  const select = (optId) => {
    if (submitted) return;
    setAnswers((a) => ({ ...a, [idx]: optId }));
  };

  const score = useMemo(() => {
    let s = 0;
    test.questions.forEach((qq, i) => { if (answers[i] === qq.answer) s++; });
    return s;
  }, [answers, test]);

  const finish = () => {
    setSubmitted(true);
    onComplete({
      id: "res-" + Date.now(),
      title: test.title,
      provider: test.provider,
      score,
      total,
      subject: test.subject,
      color: SECTIONAL_COUNTS[test.subject]?.color || "#ef4444",
    });
  };

  if (submitted) {
    return (
      <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-4 sm:space-y-5">
        <Card className="p-5 sm:p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <DonutProgress value={Math.round((score/total)*100)} size={100} stroke={9} color="#ef4444" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[var(--text-primary)]">{score}/{total}</span>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">Test Completed!</h2>
          <p className="text-[var(--text-faint)] text-sm mb-6">{test.title} · {test.provider}</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={onExit} className="flex items-center gap-2 border border-[var(--border-strong)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] text-sm font-medium rounded-lg px-5 py-2.5">
              Back to Dashboard
            </button>
            <button onClick={() => { setSubmitted(false); setAnswers({}); setIdx(0); }} className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white text-sm font-medium rounded-lg px-5 py-2.5">
              <RotateCcw size={14} /> Retry
            </button>
          </div>
        </Card>

        <div className="space-y-3">
          {test.questions.map((qq, i) => {
            const correct = answers[i] === qq.answer;
            const attempted = answers[i] !== undefined;
            return (
              <Card key={i} className="p-4">
                <div className="flex items-start gap-2 mb-2">
                  <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold mt-0.5 ${correct ? "bg-green-600" : attempted ? "bg-red-600" : "bg-[var(--border-strong)]"} text-white`}>
                    {i + 1}
                  </span>
                  <p className="text-sm text-[var(--text-secondary)]">{qq.q}</p>
                </div>
                <div className="pl-7 grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  {qq.options.map((o) => {
                    const isAns = o.id === qq.answer;
                    const isPicked = answers[i] === o.id;
                    return (
                      <div key={o.id} className={`text-xs rounded-md px-2.5 py-1.5 border ${
                        isAns ? "border-[var(--ok-border)] bg-[var(--ok-bg)] text-[var(--ok-text)]" :
                        isPicked ? "border-[var(--danger-border)] bg-[var(--accent-soft-bg)] text-[var(--danger-text)]" :
                        "border-[var(--border)] text-[var(--text-muted)]"
                      }`}>
                        <span className="font-semibold mr-1">{o.id}.</span>{o.text}
                      </div>
                    );
                  })}
                </div>
                {qq.solution && <p className="pl-7 text-xs text-[var(--text-faint)] leading-relaxed">{qq.solution}</p>}
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[var(--text-primary)] font-semibold text-sm">{test.title}</div>
          <div className="text-xs text-[var(--text-faint)]">{test.provider} · Question {idx + 1} of {total}</div>
        </div>
        <button onClick={onExit} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-muted)]">
          <X size={16} />
        </button>
      </div>
      <div className="h-1.5 bg-[var(--track-bg)] rounded-full overflow-hidden">
        <div className="h-full bg-red-600 transition-all" style={{ width: `${((idx+1)/total)*100}%` }} />
      </div>

      <Card className="p-6">
        <p className="text-[15px] text-[var(--text-primary)] leading-relaxed mb-5">{q.q}</p>
        <div className="space-y-2.5">
          {q.options.map((o) => {
            const picked = answers[idx] === o.id;
            return (
              <button
                key={o.id}
                onClick={() => select(o.id)}
                className={`w-full flex items-center gap-3 text-left rounded-lg px-4 py-3 border transition-colors ${
                  picked ? "border-red-600 bg-red-950/30" : "border-[var(--border-strong)] hover:border-[var(--border-strong)] hover:bg-[var(--hover-bg)]"
                }`}
              >
                <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold border ${
                  picked ? "bg-red-600 border-red-600 text-white" : "border-[var(--border-strong)] text-[var(--text-muted)]"
                }`}>{o.id}</span>
                <span className="text-sm text-[var(--text-secondary)]">{o.text}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] disabled:opacity-30 hover:text-[var(--text-primary)]"
        >
          <ChevronLeft size={16} /> Previous
        </button>
        <div className="flex items-center gap-1.5">
          {test.questions.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} className={`w-2 h-2 rounded-full ${
              i === idx ? "bg-red-600 w-5" : answers[i] !== undefined ? "bg-[var(--text-faint)]" : "bg-[var(--track-bg)]"
            } transition-all`} />
          ))}
        </div>
        {idx === total - 1 ? (
          <button onClick={finish} className="flex items-center gap-1.5 text-sm font-medium text-white bg-red-700 hover:bg-red-600 rounded-lg px-4 py-2">
            Submit <Check size={15} />
          </button>
        ) : (
          <button onClick={() => setIdx((i) => Math.min(total - 1, i + 1))} className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            Next <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   PRACTICE HUB
   ============================================================ */
function PracticeHub({ startPractice }) {
  const items = Object.entries(EMBEDDED_TESTS);
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Practice</h1>
        <p className="text-[var(--text-faint)] text-sm mt-1">Real questions, real solutions — pulled straight from the test bank.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(([key, t]) => {
          const subjMeta = SECTIONAL_COUNTS[t.subject];
          const color = subjMeta ? subjMeta.color : "#ef4444";
          const Icon = subjMeta ? subjMeta.icon : Layers;
          return (
            <Card key={key} className="p-5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: color + "22" }}>
                <Icon size={17} style={{ color }} />
              </div>
              <div className="text-[var(--text-primary)] font-semibold text-sm mb-1">{t.topic}</div>
              <div className="text-xs text-[var(--text-faint)] mb-4">{t.questions.length} questions · {t.provider}</div>
              <button onClick={() => startPractice(key)} className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-600 text-white text-xs font-medium rounded-lg py-2.5">
                <Play size={12} /> Start Practice
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   PERFORMANCE PAGE
   ============================================================ */
function PerformancePage({ results, stats }) {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Performance</h1>
        <p className="text-[var(--text-faint)] text-sm mt-1">Your accuracy and progress across every attempt.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4">
          <div className="text-[var(--text-muted)] text-xs mb-2">Overall Accuracy</div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.accuracy}%</div>
        </Card>
        <Card className="p-4">
          <div className="text-[var(--text-muted)] text-xs mb-2">Questions Solved</div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.questionsSolved}</div>
        </Card>
        <Card className="p-4">
          <div className="text-[var(--text-muted)] text-xs mb-2">Tests Attempted</div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.testsAttempted}</div>
        </Card>
        <Card className="p-4">
          <div className="text-[var(--text-muted)] text-xs mb-2">Sessions Logged</div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">{results.length}</div>
        </Card>
      </div>
      <Card className="p-5">
        <div className="text-[var(--text-primary)] font-semibold text-sm mb-3">Subject-wise Accuracy</div>
        <div className="space-y-4">
          {Object.entries(stats.subjectProgress).map(([key, sp]) => {
            const Icon = sp.icon;
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon size={14} style={{ color: sp.color }} />
                    <span className="text-sm text-[var(--text-secondary)]">{sp.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{sp.acc}%</span>
                </div>
                <div className="h-1.5 bg-[var(--track-bg)] rounded-full overflow-hidden">
                  <div className="h-full" style={{ width: `${sp.acc}%`, backgroundColor: sp.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      <Card className="p-5">
        <div className="text-[var(--text-primary)] font-semibold text-sm mb-3">Session History</div>
        {results.length === 0 ? (
          <p className="text-xs text-[var(--text-faint)]">No sessions yet — complete a practice test to see it here.</p>
        ) : (
          <div className="space-y-1">
            {results.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                <span className="text-sm text-[var(--text-secondary)]">{r.title}</span>
                <span className="text-sm text-[var(--text-muted)]">{r.score}/{r.total} · <span className="text-red-500 font-medium">{Math.round((r.score/r.total)*100)}%</span></span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ============================================================
   BOOKMARKS / STREAK / SETTINGS
   ============================================================ */
function BookmarksPage({ bookmarks, toggleBookmark, startPractice }) {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Bookmarks</h1>
        <p className="text-[var(--text-faint)] text-sm mt-1">Topics you've saved for later.</p>
      </div>
      {bookmarks.length === 0 ? (
        <Card className="p-5 sm:p-8 text-center">
          <Bookmark size={28} className="mx-auto text-[var(--text-faint)] mb-3" />
          <p className="text-sm text-[var(--text-faint)]">Nothing bookmarked yet. Tap the bookmark icon on any topic in Sectional Mocks.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarks.map((b) => {
            const subjMeta = SECTIONAL_COUNTS[b.subject];
            const hasReal = !!EMBEDDED_TESTS[b.key];
            return (
              <Card key={b.key} className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-[var(--text-secondary)]">{b.label}</div>
                  <div className="text-xs text-[var(--text-faint)]">{subjMeta?.label}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleBookmark(b.key, b.label, b.subject)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[var(--hover-bg)]">
                    <X size={13} className="text-[var(--text-faint)]" />
                  </button>
                  {hasReal && (
                    <button onClick={() => startPractice(b.key)} className="text-xs text-red-500 border border-[var(--accent-soft-border)] rounded-md px-2.5 py-1.5">
                      Start
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StreakPage() {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Streak</h1>
        <p className="text-[var(--text-faint)] text-sm mt-1">Consistency compounds. Keep showing up.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <Card className="p-6 text-center">
          <Flame size={32} className="mx-auto text-red-500 mb-2" fill="#ef4444" />
          <div className="text-3xl font-bold text-[var(--text-primary)]">14 days</div>
          <div className="text-xs text-[var(--text-faint)] mt-1">Current Streak</div>
        </Card>
        <Card className="p-6 text-center">
          <Trophy size={32} className="mx-auto text-red-500 mb-2" />
          <div className="text-3xl font-bold text-[var(--text-primary)]">27 days</div>
          <div className="text-xs text-[var(--text-faint)] mt-1">Longest Streak</div>
        </Card>
      </div>
      <ActivityCalendar />
    </div>
  );
}

function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const rows = [
    ["Exam", "SSC CGL"], ["Daily Goal", "5 questions"], ["Difficulty Mix", "Easy · Medium · Hard"],
    ["Notifications", "Enabled"],
  ];
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-[var(--text-faint)] text-sm mt-1">Manage your preparation preferences.</p>
      </div>
      <Card className="divide-y divide-[var(--border)]">
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-sm text-[var(--text-secondary)]">Theme</span>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 text-sm text-[var(--text-primary)] border border-[var(--border-strong)] rounded-lg px-3 py-1.5 hover:bg-[var(--hover-bg)]"
          >
            {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
            {theme === "dark" ? "Dark (Taxelea Red)" : "Light (Taxelea Red)"}
          </button>
        </div>
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-[var(--text-secondary)]">{k}</span>
            <span className="text-sm text-[var(--text-faint)]">{v}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */
export default function TaxeleaApp() {
  const [page, setPage] = useState("dashboard");
  const [activeTest, setActiveTest] = useState(null);
  const [results, setResults] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const [r, b, t] = await Promise.all([loadResults(), loadBookmarks(), loadTheme()]);
      setResults(r);
      setBookmarks(b);
      setTheme(t);
      setLoaded(true);
    })();
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      saveTheme(next);
      return next;
    });
  }, []);

  const startPractice = useCallback((key) => {
    if (!EMBEDDED_TESTS[key]) return;
    setActiveTest(key);
    setPage("practice-run");
    setMobileNavOpen(false);
  }, []);

  const handleComplete = useCallback((result) => {
    setResults((prev) => {
      const next = [result, ...prev].slice(0, 50);
      saveResults(next);
      return next;
    });
  }, []);

  const toggleBookmark = useCallback((key, label, subject) => {
    setBookmarks((prev) => {
      const exists = prev.find((b) => b.key === key);
      const next = exists ? prev.filter((b) => b.key !== key) : [...prev, { key, label, subject }];
      saveBookmarks(next);
      return next;
    });
  }, []);

  const stats = useMemo(() => {
    const baseQuestions = 428, baseAcc = 78, baseTests = 32;
    const sessionQuestions = results.reduce((s, r) => s + r.total, 0);
    const sessionCorrect = results.reduce((s, r) => s + r.score, 0);
    const baseCorrect = Math.round(baseQuestions * (baseAcc / 100));
    const questionsSolved = baseQuestions + sessionQuestions;
    const totalCorrect = baseCorrect + sessionCorrect;
    const accuracy = questionsSolved > 0 ? Math.round((totalCorrect / questionsSolved) * 100) : 0;
    const testsAttempted = baseTests + results.length;
    const todayAnswered = results.length > 0 ? Math.min(5, results.length + 3) : 3;

    const subjectProgress = {};
    Object.entries(SUBJECT_PROGRESS_BASE).forEach(([key, base]) => {
      const subjResults = results.filter((r) => r.subject === key);
      const solvedAdd = subjResults.reduce((s, r) => s + r.total, 0);
      const correctAdd = subjResults.reduce((s, r) => s + r.score, 0);
      const baseCorrectSubj = Math.round(base.solved * (base.acc / 100));
      const solved = base.solved + solvedAdd;
      const acc = solved > 0 ? Math.round(((baseCorrectSubj + correctAdd) / solved) * 100) : base.acc;
      subjectProgress[key] = { ...base, solved, acc };
    });

    return {
      questionsSolved, accuracy, testsAttempted, todayAnswered,
      solvedThisWeek: 28 + sessionQuestions, testsThisWeek: 4 + results.length,
      accDelta: results.length > 0 ? `${sessionCorrect >= sessionQuestions/2 ? "+" : ""}${accuracy - baseAcc}% this week` : "+5% this week",
      subjectProgress,
    };
  }, [results]);

  const themeVars = THEMES[theme];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div
        className="w-full h-screen flex text-[var(--text-primary)] overflow-hidden relative"
        style={{ fontFamily: "Inter, system-ui, sans-serif", backgroundColor: themeVars["--bg"], ...themeVars }}
      >
        {mobileNavOpen && (
          <div onClick={() => setMobileNavOpen(false)} className="fixed inset-0 bg-black/60 z-30 lg:hidden" />
        )}
        <div
          className={`fixed lg:static inset-y-0 left-0 z-40 h-full transform transition-transform duration-200 ease-out ${
            mobileNavOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <Sidebar
            page={page === "practice-run" ? "practice" : page}
            setPage={(p) => { setPage(p); setMobileNavOpen(false); }}
            onClose={() => setMobileNavOpen(false)}
          />
        </div>
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <Header onMenuClick={() => setMobileNavOpen(true)} />
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {!loaded ? (
            <div className="p-10 text-[var(--text-faint)] text-sm">Loading your progress…</div>
          ) : page === "dashboard" ? (
            <Dashboard setPage={setPage} startPractice={startPractice} results={results} stats={stats} />
          ) : page === "sectional" ? (
            <SectionalMocks startPractice={startPractice} bookmarks={bookmarks.map(b=>b.key)} toggleBookmark={toggleBookmark} />
          ) : page === "full" ? (
            <FullTestSeries startPractice={startPractice} />
          ) : page === "practice" ? (
            <PracticeHub startPractice={startPractice} />
          ) : page === "practice-run" ? (
            <PracticeRunner testKey={activeTest} onExit={() => setPage("dashboard")} onComplete={handleComplete} />
          ) : page === "performance" ? (
            <PerformancePage results={results} stats={stats} />
          ) : page === "bookmarks" ? (
            <BookmarksPage bookmarks={bookmarks} toggleBookmark={toggleBookmark} startPractice={startPractice} />
          ) : page === "streak" ? (
            <StreakPage />
          ) : page === "settings" ? (
            <SettingsPage />
          ) : null}
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
