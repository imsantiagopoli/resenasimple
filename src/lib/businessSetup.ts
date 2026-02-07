import { supabase } from './supabase';

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const createBusinessAndBranch = async (
  userId: string,
  restaurantName: string,
  businessType: string,
  logoUrl?: string
) => {
  try {
    const { data: businessData, error: businessError } = await supabase
      .from('business_profiles')
      .insert([
        {
          user_id: userId,
          business_name: restaurantName,
          description: `Auténtico ${businessType.toLowerCase()} con los mejores sabores.`,
          logo_url: logoUrl || null,
        }
      ])
      .select()
      .single();

    if (businessError) {
      console.error('Error creating business profile:', businessError);
      throw businessError;
    }


    const branchName = `${restaurantName}`;
    const branchSlug = generateSlug(restaurantName) + '-' + Date.now().toString().slice(-6);

    const { error: branchError } = await supabase
      .from('business_branches')
      .insert([
        {
          business_id: businessData.id,
          name: branchName,
          slug: branchSlug,
          is_main: true,
          address: '',
          phone: '',
          google_maps_link: ''
        }
      ]);

    if (branchError) {
      console.error('Error creating main branch:', branchError);
      throw branchError;
    }

    const { data: branchData, error: branchSelectError } = await supabase
      .from('business_branches')
      .select('id')
      .eq('business_id', businessData.id)
      .eq('is_main', true)
      .single();

    if (!branchSelectError && branchData) {
      const { error: configError } = await supabase
        .from('voting_configs')
        .insert([
          {
            branch_id: branchData.id,
            threshold: 4,
            config_json: {
              design: {
                message: {
                  headline: 'Queremos tu opinión. Tu experiencia nos ayuda a mejorar.',
                  body: 'Tómate un momento para compartir tu experiencia con nosotros.'
                },
                showLogo: true,
                starLabels: {
                  enabled: true,
                  labels: {
                    1: 'Muy malo',
                    2: 'Regular',
                    3: 'Aceptable',
                    4: 'Bueno',
                    5: 'Excelente'
                  }
                }
              },
              logic: {
                threshold: 4,
                publicWorkflow: {
                  thankYouMessage: 'Gracias por tu tiempo. Tu opinión nos ayuda a mejorar.',
                  buttonText: 'Califícanos en Google'
                },
                privateWorkflow: {
                  feedbackMessage: 'Tu opinión es muy valiosa. Por favor, contanos cómo podemos mejorar.',
                  thankYouMessage: 'Gracias por tu sinceridad. Tu aporte nos ayuda a crecer.',
                  collectEmail: true,
                  emailRequired: false,
                  collectName: false,
                  nameRequired: false,
                  collectPhone: false,
                  phoneRequired: false
                }
              }
            }
          }
        ]);

      if (configError) {
        console.error('Error creating voting config:', configError);
      }
    }

    return { success: true, businessData };
  } catch (error) {
    console.error('Error in createBusinessAndBranch:', error);
    throw error;
  }
};
