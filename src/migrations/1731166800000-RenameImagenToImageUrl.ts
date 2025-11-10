import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration: Rename 'imagen' column to 'imageUrl' and change type to TEXT
 * This allows storing both regular URLs and Base64 encoded images
 */
export class RenameImagenToImageUrl1731166800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if column 'imagen' exists before renaming
    const table = await queryRunner.getTable('products');
    const imagenColumn = table?.findColumnByName('imagen');

    if (imagenColumn) {
      // Rename column from 'imagen' to 'imageUrl'
      await queryRunner.renameColumn('products', 'imagen', 'imageUrl');

      // Change column type from VARCHAR(500) to TEXT to support Base64
      await queryRunner.query(`
        ALTER TABLE products 
        ALTER COLUMN "imageUrl" TYPE TEXT
      `);

      console.log('✅ Column "imagen" renamed to "imageUrl" and type changed to TEXT');
    } else {
      console.log('⚠️  Column "imagen" does not exist, skipping migration');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert: Rename back to 'imagen' and change type back to VARCHAR(500)
    const table = await queryRunner.getTable('products');
    const imageUrlColumn = table?.findColumnByName('imageUrl');

    if (imageUrlColumn) {
      // Change type back to VARCHAR(500)
      await queryRunner.query(`
        ALTER TABLE products 
        ALTER COLUMN "imageUrl" TYPE VARCHAR(500)
      `);

      // Rename column back to 'imagen'
      await queryRunner.renameColumn('products', 'imageUrl', 'imagen');

      console.log('✅ Column "imageUrl" renamed back to "imagen" and type changed to VARCHAR(500)');
    }
  }
}
