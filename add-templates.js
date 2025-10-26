import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://agzeqhesddulsetepgcc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnemVxaGVzZGR1bHNldGVwZ2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTY2MzcsImV4cCI6MjA3NjM5MjYzN30.9ed902wKVxoCNqxmBxPk7cv5ufD5oH8YJOU0FPIdtxA';

const supabase = createClient(supabaseUrl, supabaseKey);

const newTemplates = [
  // Free templates
  {
    name: 'טק מודרני',
    category: 'business',
    blocks_json: {
      layout: 'modern-tech',
      sections: ['header', 'services', 'tech-stack', 'contact'],
      colors: { primary: '#667EEA', secondary: '#764BA2' }
    },
    is_premium: false,
    sort_order: 6
  },
  {
    name: 'רפואי נקי',
    category: 'professional',
    blocks_json: {
      layout: 'medical-clean',
      sections: ['profile', 'credentials', 'services', 'appointments', 'contact'],
      colors: { primary: '#38B2AC', secondary: '#4FD1C5' }
    },
    is_premium: false,
    sort_order: 7
  },
  {
    name: 'משפטי רציני',
    category: 'professional',
    blocks_json: {
      layout: 'legal-serious',
      sections: ['profile', 'expertise', 'credentials', 'contact'],
      colors: { primary: '#2D3748', secondary: '#4A5568' }
    },
    is_premium: false,
    sort_order: 9
  },
  {
    name: 'כושר ואימונים',
    category: 'business',
    blocks_json: {
      layout: 'fitness-dynamic',
      sections: ['hero-video', 'programs', 'trainer-bio', 'schedule', 'pricing'],
      colors: { primary: '#F56565', secondary: '#ED8936' }
    },
    is_premium: false,
    sort_order: 11
  },
  {
    name: 'מוסך ותיקונים',
    category: 'business',
    blocks_json: {
      layout: 'garage-industrial',
      sections: ['services', 'pricing', 'gallery', 'hours', 'contact'],
      colors: { primary: '#E53E3E', secondary: '#2D3748' }
    },
    is_premium: false,
    sort_order: 14
  },
  {
    name: 'יופי וקוסמטיקה',
    category: 'creative',
    blocks_json: {
      layout: 'beauty-elegant',
      sections: ['hero', 'services', 'gallery', 'pricing', 'booking'],
      colors: { primary: '#D53F8C', secondary: '#B83280' }
    },
    is_premium: false,
    sort_order: 15
  },
  {
    name: 'חינוך והוראה',
    category: 'professional',
    blocks_json: {
      layout: 'education-friendly',
      sections: ['about', 'courses', 'credentials', 'testimonials', 'contact'],
      colors: { primary: '#4299E1', secondary: '#3182CE' }
    },
    is_premium: false,
    sort_order: 16
  },
  {
    name: 'טכנאי ושירותים',
    category: 'business',
    blocks_json: {
      layout: 'technician-simple',
      sections: ['services-list', 'coverage-area', 'pricing', 'reviews', 'contact'],
      colors: { primary: '#2B6CB0', secondary: '#2C5282' }
    },
    is_premium: false,
    sort_order: 18
  },
  {
    name: 'יועץ עסקי',
    category: 'professional',
    blocks_json: {
      layout: 'consultant-corporate',
      sections: ['expertise', 'clients', 'process', 'testimonials', 'contact'],
      colors: { primary: '#4A5568', secondary: '#2D3748' }
    },
    is_premium: false,
    sort_order: 19
  },
  // Premium templates
  {
    name: 'מסעדה אלגנטית',
    category: 'business',
    blocks_json: {
      layout: 'restaurant-elegant',
      sections: ['hero-image', 'menu-highlights', 'hours', 'location', 'reservations'],
      colors: { primary: '#F56565', secondary: '#ED8936' }
    },
    is_premium: true,
    sort_order: 8
  },
  {
    name: 'אמנות יצירתית',
    category: 'creative',
    blocks_json: {
      layout: 'artistic-creative',
      sections: ['hero', 'portfolio-grid', 'about', 'instagram-feed', 'contact'],
      colors: { primary: '#ED64A6', secondary: '#D53F8C' }
    },
    is_premium: true,
    sort_order: 10
  },
  {
    name: 'נדל״ן יוקרתי',
    category: 'professional',
    blocks_json: {
      layout: 'real-estate-luxury',
      sections: ['hero', 'properties-slider', 'agent-bio', 'testimonials', 'contact'],
      colors: { primary: '#805AD5', secondary: '#6B46C1' }
    },
    is_premium: true,
    sort_order: 12
  },
  {
    name: 'אופנה וסטייל',
    category: 'creative',
    blocks_json: {
      layout: 'fashion-stylish',
      sections: ['hero-full', 'collections', 'instagram', 'about', 'contact'],
      colors: { primary: '#000000', secondary: '#F7FAFC' }
    },
    is_premium: true,
    sort_order: 13
  },
  {
    name: 'צילום מקצועי',
    category: 'creative',
    blocks_json: {
      layout: 'photography-showcase',
      sections: ['hero-fullscreen', 'portfolio-masonry', 'services', 'about', 'contact'],
      colors: { primary: '#2D3748', secondary: '#718096' }
    },
    is_premium: true,
    sort_order: 17
  },
  {
    name: 'אירועים וקייטרינג',
    category: 'business',
    blocks_json: {
      layout: 'events-vibrant',
      sections: ['hero', 'services', 'gallery', 'packages', 'contact'],
      colors: { primary: '#F6AD55', secondary: '#ED8936' }
    },
    is_premium: true,
    sort_order: 20
  }
];

async function addTemplates() {
  console.log('Adding new templates...\n');

  for (const template of newTemplates) {
    const { data, error } = await supabase
      .from('templates')
      .insert(template)
      .select();

    if (error) {
      if (error.message.includes('duplicate')) {
        console.log(`⚠️  Template "${template.name}" already exists - skipping`);
      } else {
        console.error(`❌ Error adding "${template.name}":`, error.message);
      }
    } else {
      const type = template.is_premium ? '💎 Premium' : '✅ Free';
      console.log(`${type} "${template.name}" added successfully`);
    }
  }

  // Get total count
  const { data: templates, error } = await supabase
    .from('templates')
    .select('*')
    .order('sort_order');

  if (templates) {
    console.log(`\n📊 Total templates in system: ${templates.length}`);
    console.log(`   Free: ${templates.filter(t => !t.is_premium).length}`);
    console.log(`   Premium: ${templates.filter(t => t.is_premium).length}`);

    console.log('\n📋 All templates:');
    templates.forEach((t, i) => {
      const type = t.is_premium ? '💎' : '✅';
      console.log(`   ${i + 1}. ${type} ${t.name} (${t.category})`);
    });
  }
}

addTemplates();
