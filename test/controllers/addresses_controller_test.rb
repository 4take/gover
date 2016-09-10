require 'test_helper'

class AddressesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @address = addresses(:one)
  end

  test "should get index" do
    get addresses_url, as: :json
    assert_response :success
  end

  test "should create address" do
    assert_difference('Address.count') do
      post addresses_url, params: { address: { address1: @address.address1, address2: @address.address2, city: @address.city, prefecture_code: @address.prefecture_code, user_id: @address.user_id, zip_code: @address.zip_code } }, as: :json
    end

    assert_response 201
  end

  test "should show address" do
    get address_url(@address), as: :json
    assert_response :success
  end

  test "should update address" do
    patch address_url(@address), params: { address: { address1: @address.address1, address2: @address.address2, city: @address.city, prefecture_code: @address.prefecture_code, user_id: @address.user_id, zip_code: @address.zip_code } }, as: :json
    assert_response 200
  end

  test "should destroy address" do
    assert_difference('Address.count', -1) do
      delete address_url(@address), as: :json
    end

    assert_response 204
  end
end
