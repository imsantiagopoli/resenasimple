/*
  # Insert sample data for development

  1. Sample Data
    - Creates a sample business profile for testing
    - Creates sample branches
    - Creates sample social media links
    - Creates sample voting configurations

  Note: This migration is optional and only for development/testing purposes
*/

-- Function to create sample data (only if no data exists)
DO $$
DECLARE
  sample_user_id uuid;
  sample_business_id uuid;
  sample_branch_id uuid;
BEGIN
  -- Only create sample data if profiles table is empty
  IF NOT EXISTS (SELECT 1 FROM business_profiles LIMIT 1) THEN
    
    -- Get a user ID from auth.users (if any exists)
    SELECT id INTO sample_user_id FROM auth.users LIMIT 1;
    
    -- If no users exist, skip sample data creation
    IF sample_user_id IS NOT NULL THEN
      
      -- Create sample business profile
      INSERT INTO business_profiles (id, user_id, name, description, phone, email, website)
      VALUES (
        gen_random_uuid(),
        sample_user_id,
        'Pizzería Napolitana',
        'Auténtica pizza napolitana con ingredientes frescos importados de Italia.',
        '+54 11 4567-8901',
        'info@pizzerianapolitana.com',
        'https://pizzerianapolitana.com'
      )
      RETURNING id INTO sample_business_id;
      
      -- Create sample branches
      INSERT INTO business_branches (business_id, name, address, phone, slug, is_main)
      VALUES 
        (sample_business_id, 'Sucursal Centro', 'Av. Corrientes 1234, Buenos Aires', '+54 11 4567-8901', 'pizzeria-napolitana-centro', true),
        (sample_business_id, 'Sucursal Palermo', 'Thames 456, Palermo, Buenos Aires', '+54 11 4567-8902', 'pizzeria-napolitana-palermo', false),
        (sample_business_id, 'Sucursal Belgrano', 'Cabildo 789, Belgrano, Buenos Aires', '+54 11 4567-8903', 'pizzeria-napolitana-belgrano', false);
      
      -- Create sample social media
      INSERT INTO business_social_media (business_id, platform, url)
      VALUES 
        (sample_business_id, 'facebook', 'https://facebook.com/pizzerianapolitana'),
        (sample_business_id, 'instagram', 'https://instagram.com/pizzerianapolitana'),
        (sample_business_id, 'website', 'https://pizzerianapolitana.com'),
        (sample_business_id, 'tiktok', 'https://tiktok.com/@pizzerianapolitana');
      
      -- Create sample voting configs for each branch
      INSERT INTO voting_configs (branch_id, threshold, config_json)
      SELECT 
        b.id,
        4,
        jsonb_build_object(
          'design', jsonb_build_object(
            'message', jsonb_build_object(
              'headline', 'Queremos tu opinión. Tu experiencia nos ayuda a mejorar.',
              'body', 'Tomate un momento para compartir tu experiencia con nosotros.'
            ),
            'showLogo', true,
            'starLabels', jsonb_build_object(
              'enabled', true,
              'labels', jsonb_build_object(
                '1', 'Muy malo',
                '2', 'Regular',
                '3', 'Aceptable',
                '4', 'Bueno',
                '5', 'Excelente'
              )
            )
          ),
          'logic', jsonb_build_object(
            'threshold', 4,
            'smartAutoRedirect', true
          )
        )
      FROM business_branches b 
      WHERE b.business_id = sample_business_id;
      
      RAISE NOTICE 'Sample data created successfully for business: %', sample_business_id;
      
    ELSE
      RAISE NOTICE 'No users found, skipping sample data creation';
    END IF;
    
  ELSE
    RAISE NOTICE 'Business profiles already exist, skipping sample data creation';
  END IF;
  
END $$;