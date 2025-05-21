import {
  type MigrationInterface,
  type QueryRunner,
  Table,
  // TableIndex,
  // TableForeignKey,
} from 'typeorm';

export class Initial1744870604544 implements MigrationInterface {
  name = 'Initial1744870604544';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'order',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'external_id',
            type: 'integer',
            isUnique: true,
            isNullable: true,
          },
          {
            name: 'tab_payer',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'integer',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
    // await queryRunner.createIndex(
    //   'order',
    //   new TableIndex({
    //     name: 'IDX_TAB_PAYER',
    //     columnNames: ['tab_payer'],
    //   }),
    // );

    await queryRunner.createTable(
      new Table({
        name: 'payment',
        foreignKeys: [
          {
            columnNames: ['orderId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'order',
          },
        ],
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            generationStrategy: 'increment',
            isGenerated: true,
          },
          {
            name: 'external_id', // external API database id
            type: 'integer',
            isUnique: true,
            isNullable: true,
          },
          {
            name: 'orderId', // external API database id
            type: 'integer',
          },
          {
            name: 'mode', // 0 = 'cash', 1 = 'card', ...
            type: 'integer',
          },
          {
            name: 'amount', // payment amount
            type: 'integer',
            unsigned: true,
          },
          {
            name: 'type', // 0 = 'charge', 1 = 'refund'
            type: 'integer',
            unsigned: true,
          },
          {
            name: 'created_at',
            type: 'integer',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'category',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'external_id', // external API database id
            type: 'integer',
            isUnique: true,
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'product',
        foreignKeys: [
          {
            columnNames: ['categoryId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'category',
          },
        ],
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'external_id', // external API database id
            type: 'integer',
            isUnique: true,
            isNullable: true,
          },
          {
            name: 'categoryId',
            type: 'integer',
          },
          {
            name: 'label',
            type: 'varchar',
          },
          {
            name: 'price',
            type: 'integer',
            unsigned: true,
          },
          {
            name: 'main_pic',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'stock',
            type: 'integer',
            unsigned: true,
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'order_to_product',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            type: 'integer',
            name: 'productId',
          },
          {
            type: 'integer',
            name: 'orderId',
          },
          {
            type: 'integer',
            name: 'quantity',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['orderId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'order',
          },
          {
            columnNames: ['productId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'product',
          },
        ],
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const paymentTable = await queryRunner.getTable('payment');
    const orderForeignKey = paymentTable!.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('orderId') !== -1,
    );
    await queryRunner.dropForeignKey('payment', orderForeignKey!);
    await queryRunner.dropColumn('payment', 'orderId');
    await queryRunner.dropTable('payment');
    await queryRunner.dropIndex('order', 'IDX_TAB_PAYER');
    await queryRunner.dropTable('order');

    const productTable = await queryRunner.getTable('product');
    const categoryForeignKey = productTable!.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('categoryId') !== -1,
    );
    await queryRunner.dropForeignKey('product', categoryForeignKey!);
    await queryRunner.dropColumn('product', 'categoryId');
    await queryRunner.dropTable('product');
    await queryRunner.dropTable('category');
  }
}
