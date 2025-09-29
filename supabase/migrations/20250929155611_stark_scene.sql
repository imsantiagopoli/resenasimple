/*
  # Create QR Configuration Table

  1. New Tables
    - `qr_configuration`
      - `id` (uuid, primary key)
      - `business_id` (uuid, foreign key to business_profiles)
      - `qr_size` (integer, default 200)
      - `qr_foreground_color` (text, default '#000000')
      - `qr_background_color` (text, default '#FFFFFF')
      - `qr_error_correction_level` (text, default 'M')
      - `qr_margin` (integer, default 4)
      - `show_frame` (boolean, default false)
      - `frame_color` (text, default '#000000')
      - `frame_thickness` (integer, default 2)
      - `show_title` (boolean, default true)
      - `title` (text, default '¡Déjanos tu opinión!')
      - `show_subtitle` (boolean, default true)
      - `subtitle` (text, default 'Escanea el código QR para acceder')
      - `show_call_to_action` (boolean, default true)
      - `call_to_action` (text, default '¡Ayúdanos a mejorar!')
      - `print_format` (text, default 'A4')
      - `print_orientation` (text, default 'portrait')
      - `qrs_per_page` (integer, default 1)
      - `include_instructions` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `qr_configuration` table
    - Add policies for business owners to manage their QR configurations
    - Add policy for anonymous users to read QR configurations

  3. Constraints
    - Unique constraint on business_id
    - Check constraints for QR size, margin, and error correction level
    - Foreign key constraint to business_profiles