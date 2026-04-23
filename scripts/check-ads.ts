import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function checkAds() {
  console.log('Checking ads table...');

  const { data: ads, error } = await supabase
    .from('ads')
    .select('*')
    .limit(10);

  if (error) {
    console.error('Error fetching ads:', error.message);
    process.exit(1);
  }

  console.log(`Total ads found: ${ads?.length || 0}`);

  if (ads && ads.length > 0) {
    console.log('\nSample ads:');
    ads.forEach(ad => {
      console.log(`- ${ad.title} (ID: ${ad.id}, Status: ${ad.status})`);
    });
  } else {
    console.log('\nNo ads found. Creating sample ads...');

    // Create sample ads
    const sampleAds = [
      {
        id: crypto.randomUUID(),
        title: 'Sample Ad 1',
        slug: 'sample-ad-1',
        description: 'This is a sample advertisement',
        user_id: '5fbb7c86-5cc2-4360-9bef-59ecdb59dd2d', // user@adflow.com
        category: 'electronics',
        city: 'karachi',
        price: 1000,
        currency: 'USD',
        status: 'published',
        tags: ['sample', 'test'],
        media: [],
        views: 0,
        clicks: 0,
      },
      {
        id: crypto.randomUUID(),
        title: 'Sample Ad 2',
        slug: 'sample-ad-2',
        description: 'Another sample advertisement',
        user_id: 'd975888a-fe96-4a24-a9be-f9ea54eb5401', // admin@adflow.com
        category: 'services',
        city: 'lahore',
        price: 500,
        currency: 'USD',
        status: 'published',
        tags: ['sample', 'test'],
        media: [],
        views: 0,
        clicks: 0,
      },
    ];

    for (const ad of sampleAds) {
      const { error: insertError } = await supabase
        .from('ads')
        .insert(ad);

      if (insertError) {
        console.error(`Failed to insert ad: ${ad.title}`, insertError.message);
      } else {
        console.log(`✅ Created: ${ad.title}`);
      }
    }

    console.log('\nSample ads created successfully!');
  }
}

checkAds()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
