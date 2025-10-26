import {
  Smartphone,
  BarChart3,
  Palette,
  Share2,
  Lock,
  Globe
} from 'lucide-react';

const features = [
  {
    icon: Smartphone,
    title: 'מותאם למובייל',
    description: 'כרטיס שנראה מושלם בכל מכשיר - מחשב, טאבלט וסמארטפון',
    color: 'blue'
  },
  {
    icon: BarChart3,
    title: 'אנליטיקה מתקדמת',
    description: 'מעקב אחר צפיות, קליקים ואינטראקציות עם הכרטיס שלך',
    color: 'purple'
  },
  {
    icon: Palette,
    title: 'עיצוב מותאם אישית',
    description: 'בחר מתוך תבניות מקצועיות והתאם צבעים בהתאם למותג שלך',
    color: 'pink'
  },
  {
    icon: Share2,
    title: 'שיתוף קל',
    description: 'שתף את הכרטיס בוואטסאפ, מייל או כל פלטפורמה עם קליק אחד',
    color: 'green'
  },
  {
    icon: Lock,
    title: 'מאובטח ומוגן',
    description: 'הנתונים שלך מוצפנים ומאוחסנים בצורה בטוחה',
    color: 'red'
  },
  {
    icon: Globe,
    title: 'דומיין מותאם אישית',
    description: 'הוסף דומיין משלך לכרטיס (בתוכנית Pro)',
    color: 'orange'
  }
];

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  pink: 'bg-pink-100 text-pink-600',
  green: 'bg-green-100 text-green-600',
  red: 'bg-red-100 text-red-600',
  orange: 'bg-orange-100 text-orange-600'
};

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            כל מה שאתה צריך במקום אחד
          </h2>
          <p className="text-xl text-gray-600">
            פלטפורמה שלמה ליצירת כרטיס ביקור דיגיטלי מקצועי עם כל הכלים שאתה צריך
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="card hover:shadow-md transition-shadow group"
              >
                <div className={`inline-flex p-3 rounded-xl ${colorClasses[feature.color as keyof typeof colorClasses]} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
