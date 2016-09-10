class CreateAddresses < ActiveRecord::Migration[5.0]
  def change
    create_table :addresses do |t|
      t.integer :user_id, index: true, foreign_key: true
      t.string :prefecture_code
      t.string :city
      t.string :address1
      t.string :address2
      t.string :zip_code
      t.string :token

      t.timestamps
    end
  end
end
